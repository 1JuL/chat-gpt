import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useFonts } from "expo-font";
import Markdown from "react-native-markdown-display";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { APIResponse, Message } from "@/interfaces/AppInterfaces";
import styles from "../styles/ChatStyles";

export default function Chat() {
  const [loaded] = useFonts({
    RalewayReg: require("../assets/fonts/raleway.regular.ttf"),
  });

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

  // Función para llamar a la API usando axios
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

  // Función que se ejecuta al enviar el mensaje
  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Agregar mensaje del usuario a la lista
    const userMessage: Message = {
      text: inputText,
      sender_by: "User",
      date: new Date(),
      state: "Sent",
    };
    setMessages((prev) => [...prev, userMessage]);

    setInputText("");

    // Obtener la respuesta del bot y agregarla a la lista
    const botText = await getResponse(inputText);
    const botMessage: Message = {
      text: botText,
      sender_by: "Bot",
      date: new Date(),
      state: "Received",
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
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
            {/* Renderizamos el mensaje usando Markdown */}
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
          <MaterialCommunityIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
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
