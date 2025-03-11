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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import styles from "../../styles/DashboardStyles";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import {
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  setDoc,
  getDocs,
  collection,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/utils/firebase";

export default function Dashboard() {
  const { logout, user } = useAuth();
  const { getUserChats } = useData();
  const router = useRouter();

  const [loaded] = useFonts({
    Raleway: require("../../assets/fonts/raleway.semibold.ttf"),
  });

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null); // Chat seleccionado para el dropdown
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Estado único para spinner en edición y borrado

  // Cargar los chats del usuario en tiempo real, filtrados por userId
  useEffect(() => {
    if (user) {
      const unsubscribe = getUserChats(user.uid, (fetchedChats) => {
        setChats(fetchedChats);
        setConversationsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Ordenar chats de más reciente a más viejo (se asume que cada chat tiene el campo createdAt)
  const sortedChats = [...chats].sort((a, b) => {
    const aTime = a.createdAt ? a.createdAt.seconds : 0;
    const bTime = b.createdAt ? b.createdAt.seconds : 0;
    return bTime - aTime;
  });

  // Alterna el dropdown y asigna el chat seleccionado
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

  const handleDeleteChat = async () => {
    if (!selectedChat) return;
    setIsLoading(true);
    const conversationRef = doc(db, "conversations", selectedChat.id);
    const deletedRef = doc(db, "deletedConversations", selectedChat.id);
    try {
      // Obtiene el documento de la conversación
      const conversationSnap = await getDoc(conversationRef);
      if (!conversationSnap.exists()) {
        throw "Conversation does not exist!";
      }
      const conversationData = conversationSnap.data();

      // Lee todos los mensajes de la subcolección "messages"
      const messagesRef = collection(db, "conversations", selectedChat.id, "messages");
      const messagesSnapshot = await getDocs(messagesRef);
      const messagesData = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Combina la data de la conversación con los mensajes
      const combinedData = {
        ...conversationData,
        messages: messagesData,
      };

      // Copia el documento combinado a deletedConversations
      await setDoc(deletedRef, combinedData);

      // Borra todos los mensajes de la subcolección mediante un batch
      const batch = writeBatch(db);
      messagesSnapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();

      // Borra el documento de la conversación
      await deleteDoc(conversationRef);

      // Actualiza el estado local
      setChats((prev) => prev.filter((chat) => chat.id !== selectedChat.id));
    } catch (error) {
      console.error("Error moving conversation:", error);
    } finally {
      setIsLoading(false);
      closeDropdown();
    }
  };

  // Mostrar confirmación para borrar una conversación
  const confirmDeleteChat = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this conversation?", [
      { text: "Cancel", style: "cancel", onPress: closeDropdown },
      { text: "Delete", style: "destructive", onPress: handleDeleteChat },
    ]);
  };

  // Función para abrir el modal de edición y asignar el título actual
  const openEditModal = () => {
    if (!selectedChat) return;
    setNewTitle(selectedChat.text || "");
    setEditModalVisible(true);
  };

  // Función para editar el título de la conversación (campo "text")
  const handleEditChat = async () => {
    if (!selectedChat) return;
    if (!newTitle.trim()) return;
    setIsLoading(true);
    try {
      const conversationRef = doc(db, "conversations", selectedChat.id);
      await updateDoc(conversationRef, { text: newTitle });
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

  // Función para mover todas las conversaciones a deletedConversations (incluyendo sus subcolecciones)
  const handleClearConversations = async () => {
    Alert.alert("Clear All Conversations", "Are you sure you want to clear all conversations?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            for (const chat of chats) {
              const conversationRef = doc(db, "conversations", chat.id);
              const deletedRef = doc(db, "deletedConversations", chat.id);
              const conversationSnap = await getDoc(conversationRef);
              if (conversationSnap.exists()) {
                const conversationData = conversationSnap.data();
                const messagesRef = collection(db, "conversations", chat.id, "messages");
                const messagesSnapshot = await getDocs(messagesRef);
                const messagesData = messagesSnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                const combinedData = {
                  ...conversationData,
                  messages: messagesData,
                };
                await setDoc(deletedRef, combinedData);
                const batch = writeBatch(db);
                messagesSnapshot.docs.forEach((docSnap) => {
                  batch.delete(docSnap.ref);
                });
                await batch.commit();
                await deleteDoc(conversationRef);
              }
            }
            setChats([]);
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
    <View style={styles.container}>
      {/* Spinner para cuando se están realizando acciones que toman tiempo de carga */}
      {isLoading && (
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <ActivityIndicator size="large" color="#10A37F" />
        </View>
      )}

      {/* Spinner en la parte superior mientras se cargan las conversaciones */}
      {conversationsLoading && (
        <ActivityIndicator size="large" color="#10A37F" style={{ marginTop: 10 }} />
      )}

      {/* Sección superior: Mostrar las conversaciones del usuario */}
      <ScrollView style={styles.topSection}>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => {
            router.push("/chat");
          }}
        >
          <View style={styles.leftGroup}>
            <MaterialCommunityIcons name="message-outline" size={20} color="#fff" />
            <Text style={styles.newChatText}>New Chat</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#fff"
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
              <MaterialCommunityIcons name="message-outline" size={20} color="#fff" />
              <Text style={styles.recentChatText}>{chat.text || "Untitled Chat"}</Text>
            </View>
            <View style={styles.rightGroup}>
              <TouchableOpacity onPress={() => toggleDropdown(chat)}>
                <MaterialCommunityIcons
                  name="dots-horizontal"
                  size={20}
                  color="#fff"
                  style={styles.iconDots}
                />
              </TouchableOpacity>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#fff"
                style={styles.iconRight}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal para editar el título de la conversación */}
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

      {/* Dropdown para Settings */}
      {dropdownVisible && selectedChat && (
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <TouchableOpacity style={styles.dropdownItem} onPress={openEditModal}>
                  <MaterialCommunityIcons
                    name="square-edit-outline"
                    size={20}
                    color="#fff"
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

      {/* Sección inferior */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.button} onPress={handleClearConversations}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Clear Conversations</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* acción para upgrade */
          }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Upgrade to Plus</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* acción para cambiar tema */
          }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="weather-sunny"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Light Mode</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* acción para ver actualizaciones */
          }}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="update" size={20} color="#fff" style={styles.icon} />
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
  );
}
