import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useFonts } from "expo-font";
import Markdown from "react-native-markdown-display";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { APIResponse, Message } from "@/interfaces/AppInterfaces";
import darkStyles from "../../styles/ChatDarkStyles";
import lightStyles from "../../styles/ChatLightStyles";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useData } from "@/context/DataContext";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";

export default function Chat() {
  const [loaded] = useFonts({
    RalewayReg: require("../../assets/fonts/raleway.regular.ttf"),
  });
  const params = useLocalSearchParams();
  const { chatId } = params;
  const [conversationId, setConversationId] = useState<string | null>(
    chatId ? String(chatId) : null
  );

  const { theme } = useTheme();
  const styles = theme === "dark" ? darkStyles : lightStyles;

  const [inputText, setInputText] = useState("");
  const [initialLoad, setInitialLoad] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { createChat, addMessage } = useData();
  const scrollViewRef = useRef<ScrollView>(null);
  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

  useEffect(() => {
    if (!conversationId) return;
    setInitialLoad(true);
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          text: data.text || "",
          sender_by: data.sender_by || "",
          date: data.date && data.date.toDate ? data.date.toDate() : new Date(),
          state: data.state || "Sent",
        };
      });
      setMessages((prev) => {
        if (loadedMessages.length === 0 && prev.length > 0) {
          return prev;
        }
        return loadedMessages;
      });
      setInitialLoad(false);
    });
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const getResponse = async (userText: string): Promise<string> => {
    try {
      const response = await axios.post<APIResponse>(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: userText }],
            },
          ],
        }
      );
      const botResponse = response.data?.candidates[0]?.content?.parts[0]?.text;
      return botResponse;
    } catch (error) {
      console.log("Error:", error);
      return "Error en la respuesta del bot.";
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setSending(true);
    const messageText = inputText;
    setInputText("");

    let currentConversationId = conversationId;
    if (!currentConversationId) {
      currentConversationId = Date.now().toString();
      try {
        const chatTitle =
          messageText.length > 20 ? messageText.substring(0, 20) + "..." : messageText;
        await createChat(currentConversationId, chatTitle, []);
        setConversationId(currentConversationId);
      } catch (error) {
        console.error("Error creando conversación:", error);
        setSending(false);
        return;
      }
    }

    const userMessage: Message = {
      text: messageText,
      sender_by: "User",
      date: new Date(),
      state: "Sent",
    };
    setMessages((prev) => [...prev, userMessage]);

    const botText = await getResponse(messageText);
    const botMessage: Message = {
      text: botText,
      sender_by: "Bot",
      date: new Date(),
      state: "Received",
    };

    setMessages((prev) => [...prev, botMessage]);

    try {
      await addMessage(currentConversationId, userMessage);
      await addMessage(currentConversationId, botMessage);
    } catch (error) {
      console.error("Error al guardar mensajes:", error);
    }
    setSending(false);
  };

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <ScrollView ref={scrollViewRef} style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.sender_by === "User" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Markdown style={theme === "dark" ? markdownStyles : {}}>{msg.text}</Markdown>
              <Text style={styles.messageTime}>{msg.date.toLocaleTimeString()}</Text>
            </View>
          ))}
          {/* Spinner de carga*/}
          {(sending || initialLoad) && (
            <ActivityIndicator size="large" color="#10A37F" style={styles.loadingIndicator} />
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask Gemini ..."
            placeholderTextColor={theme === "dark" ? "#fff" : "#000"}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={[styles.sendButton, sending && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={sending}
          >
            <MaterialCommunityIcons
              name="send"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const markdownStyles = {
  body: {
    fontSize: 16,
    color: "white",
    fontFamily: "RalewayReg",
  },
  code_inline: {
    fontSize: 12,
    backgroundColor: "#f5f5f5",
    color: "#000",
    borderRadius: 4,
    padding: 2,
    fontFamily: "monospace",
  },
  fence: {
    fontSize: 12,
    backgroundColor: "#f5f5f5",
    color: "#000",
    borderRadius: 4,
    padding: 8,
    fontFamily: "monospace",
  },
};
