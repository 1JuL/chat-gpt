import React, { useEffect, useState } from "react";
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
import styles from "../../styles/ChatStyles";
import { collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useData } from "@/context/DataContext";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Chat() {
  const params = useLocalSearchParams();
  const { chatId } = params;

  const [loaded] = useFonts({
    RalewayReg: require("../../assets/fonts/raleway.regular.ttf"),
  });
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(
    chatId ? String(chatId) : null
  );

  const { createChat, addMessage } = useData();

  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

  useEffect(() => {
    if (!conversationId) return;
    setIsLoading(true);
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
      setMessages(loadedMessages);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [conversationId]);

  const getResponse = async (userText: string): Promise<string> => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    let currentConversationId = conversationId;
    if (!currentConversationId) {
      currentConversationId = Date.now().toString();
      try {
        // Usa los primeros 20 caracteres del mensaje del usuario como título de la conversación
        const chatTitle = inputText.length > 20 ? inputText.substring(0, 20) + "..." : inputText;
        await createChat(currentConversationId, chatTitle, []);
        setConversationId(currentConversationId);
      } catch (error) {
        console.error("Error creando conversación:", error);
        return;
      }
    }

    // Crear el objeto del mensaje del usuario
    const userMessage: Message = {
      text: inputText,
      sender_by: "User",
      date: new Date(),
      state: "Sent",
    };

    // Actualiza la UI agregando el mensaje del usuario
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Obtener respuesta del bot
    const botText = await getResponse(inputText);
    const botMessage: Message = {
      text: botText,
      sender_by: "Bot",
      date: new Date(),
      state: "Received",
    };

    // Actualiza la UI agregando el mensaje del bot
    setMessages((prev) => [...prev, botMessage]);

    try {
      // Guarda ambos mensajes en la subcolección "messages" de la conversación
      await addMessage(currentConversationId, userMessage);
      await addMessage(currentConversationId, botMessage);
    } catch (error) {
      console.error("Error al guardar mensajes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.sender_by === "User" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Markdown style={markdownStyles}>{msg.text}</Markdown>
              <Text style={styles.messageTime}>{msg.date.toLocaleTimeString()}</Text>
            </View>
          ))}
          {isLoading && (
            <ActivityIndicator size="large" color="#10A37F" style={styles.loadingIndicator} />
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask Gemini ..."
            placeholderTextColor="white"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialCommunityIcons name="send" size={24} color="white" />
            )}
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
