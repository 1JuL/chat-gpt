import React, { createContext, useContext, useState } from "react";
import { DataContextType, Message } from "@/interfaces/AppInterfaces";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAuth } from "./AuthContext";

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const conversationsCollection = collection(db, "conversations");

  const createChat = async (conversationId: string, text: string, messages: Message[]) => {
    try {
      const conversationDocRef = doc(db, "conversations", conversationId);
      await setDoc(conversationDocRef, {
        text,
        messages,
        userId: user?.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creando conversación:", error);
      throw error;
    }
  };

  const updateChat = async (conversationId: string, text: string, messages: Message[]) => {
    try {
      const conversationDocRef = doc(db, "conversations", conversationId);
      await updateDoc(conversationDocRef, {
        text,
        messages,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error actualizando conversación:", error);
      throw error;
    }
  };

  const deleteChat = async (conversationId: string) => {
    try {
      const conversationDocRef = doc(db, "conversations", conversationId);
      await deleteDoc(conversationDocRef);
    } catch (error) {
      console.error("Error borrando conversación:", error);
      throw error;
    }
  };

  const getChat = async (conversationId: string) => {
    try {
      const conversationDocRef = doc(db, "conversations", conversationId);
      const docSnap = await getDoc(conversationDocRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("La conversación no existe");
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo conversación:", error);
      throw error;
    }
  };

  // Aquí se escribe cada mensaje en la subcolección "messages"
  const addMessage = async (conversationId: string, message: Message) => {
    try {
      await addDoc(collection(db, "conversations", conversationId, "messages"), {
        ...message,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error añadiendo mensaje:", error);
      throw error;
    }
  };

  // Escucha en tiempo real las conversaciones de un usuario
  const getUserChats = (userId: string, setChats: (chats: any[]) => void) => {
    const q = query(conversationsCollection, where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChats(chats);
    });
    return unsubscribe;
  };

  return (
    <DataContext.Provider
      value={{
        createChat,
        updateChat,
        deleteChat,
        getChat,
        addMessage,
        getUserChats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
