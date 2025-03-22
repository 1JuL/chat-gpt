import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import darkStyles from "../../styles/DashboardDarkStyles";
import lightStyles from "../../styles/DashboardLightStyles";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";

export default function Dashboard() {
  const { logout, user } = useAuth();
  const { getUserChats, deleteChat, clearConversations, updateChat } = useData();
  const router = useRouter();

  const [loaded] = useFonts({
    Raleway: require("../../assets/fonts/raleway.semibold.ttf"),
  });

  const { theme, toggleTheme } = useTheme();
  const styles = theme === "dark" ? darkStyles : lightStyles;

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cargar los chats del usuario en tiempo real
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const unsubscribe = getUserChats(user.uid, (fetchedChats) => {
        setChats(fetchedChats);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Ordenar los chats de más reciente a más viejo
  const sortedChats = [...chats].sort((a, b) => {
    const aTime = a.createdAt ? a.createdAt.seconds : 0;
    const bTime = b.createdAt ? b.createdAt.seconds : 0;
    return bTime - aTime;
  });

  const toggleDropdown = (chat: any) => {
    if (dropdownVisible && selectedChat?.id === chat.id) {
      setDropdownVisible(false);
      setSelectedChat(null);
    } else {
      setSelectedChat(chat);
      setDropdownVisible(true);
    }
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
    setSelectedChat(null);
  };

  // Función para borrar una conversación usando deleteChat del DataContext
  const handleDeleteChat = async () => {
    if (!selectedChat) return;
    setIsLoading(true);
    try {
      await deleteChat(selectedChat.id);
      setChats((prev) => prev.filter((chat) => chat.id !== selectedChat.id));
    } catch (error) {
      console.error("Error deleting conversation:", error);
    } finally {
      setIsLoading(false);
      closeDropdown();
    }
  };

  const confirmDeleteChat = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this conversation?", [
      { text: "Cancel", style: "cancel", onPress: closeDropdown },
      { text: "Delete", style: "destructive", onPress: handleDeleteChat },
    ]);
  };

  const openEditModal = () => {
    if (!selectedChat) return;
    setNewTitle(selectedChat.text || "");
    setEditModalVisible(true);
  };

  // Actualizar el título de la conversación usando updateChat del DataContext
  const handleEditChat = async () => {
    if (!selectedChat || !newTitle.trim()) return;
    setIsLoading(true);
    try {
      await updateChat(selectedChat.id, newTitle, selectedChat.messages || []);
      setChats((prev) =>
        prev.map((chat) => (chat.id === selectedChat.id ? { ...chat, text: newTitle } : chat))
      );
    } catch (error) {
      console.error("Error editing conversation title:", error);
    } finally {
      setIsLoading(false);
      setEditModalVisible(false);
      closeDropdown();
    }
  };

  // Borrar todas las conversaciones del usuario usando clearConversations del DataContext
  const handleClearConversations = async () => {
    Alert.alert("Clear All Conversations", "Are you sure you want to clear all conversations?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            if (user) {
              await clearConversations(user.uid);
              setChats([]);
            }
          } catch (error) {
            console.error("Error clearing conversations:", error);
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  if (!loaded) return null;

  return (
    <>
      <StatusBar
        style={theme === "dark" ? "light" : "dark"}
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10A37F" />
          </View>
        )}

        <ScrollView style={styles.topSection}>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => {
              router.push("/chat");
            }}
          >
            <View style={styles.leftGroup}>
              <MaterialCommunityIcons
                name="message-outline"
                size={20}
                color={theme === "dark" ? "#fff" : "#000"}
              />
              <Text style={styles.newChatText}>New Chat</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={theme === "dark" ? "#fff" : "#000"}
              style={styles.iconRight}
            />
          </TouchableOpacity>

          {sortedChats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.recentChatButton}
              onPress={() => {
                router.push(`/chat?chatId=${chat.id}`);
              }}
            >
              <View style={styles.leftGroup}>
                <MaterialCommunityIcons
                  name="message-outline"
                  size={20}
                  color={theme === "dark" ? "#fff" : "#000"}
                />
                <Text style={styles.recentChatText}>{chat.text || "Untitled Chat"}</Text>
              </View>
              <View style={styles.rightGroup}>
                <TouchableOpacity onPress={() => toggleDropdown(chat)}>
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={20}
                    color={theme === "dark" ? "#fff" : "#000"}
                    style={styles.iconDots}
                  />
                </TouchableOpacity>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={theme === "dark" ? "#fff" : "#000"}
                  style={styles.iconRight}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Modal
          visible={editModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Chat Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter new title"
              placeholderTextColor="#888"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEditChat}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {dropdownVisible && selectedChat && (
          <TouchableWithoutFeedback onPress={closeDropdown}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback>
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={openEditModal}>
                    <MaterialCommunityIcons
                      name="square-edit-outline"
                      size={20}
                      color={theme === "dark" ? "#fff" : "#000"}
                      style={styles.icon}
                    />
                    <Text style={styles.dropdownText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={confirmDeleteChat}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color="#ED8C8C"
                      style={styles.icon}
                    />
                    <Text style={[styles.dropdownText, { color: "#ED8C8C" }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.button} onPress={handleClearConversations}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={20}
                color={theme === "dark" ? "#fff" : "#000"}
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Clear Conversations</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="account-plus-outline"
                size={20}
                color={theme === "dark" ? "#fff" : "#000"}
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Upgrade to Plus</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={toggleTheme}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="weather-sunny"
                size={20}
                color={theme === "dark" ? "#fff" : "#000"}
                style={styles.icon}
              />
              <Text style={styles.buttonText}>{theme === "dark" ? "Light Mode" : "Dark Mode"}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Linking.openURL("https://gemini.google.com/updates").catch((err) =>
                console.error("Error al abrir la URL:", err)
              );
            }}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="update"
                size={20}
                color={theme === "dark" ? "#fff" : "#000"}
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Updates & FAQ</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.lastButton]}
            onPress={async () => {
              try {
                await logout();
                router.replace("/home");
              } catch (error) {
                console.error("Error al cerrar sesión:", error);
              }
            }}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="logout" size={20} color="#ED8C8C" style={styles.icon} />
              <Text style={styles.redText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
