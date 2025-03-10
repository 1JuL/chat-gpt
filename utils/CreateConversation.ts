import { db } from "../utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const createConversation = async (): Promise<string> => {
  try {
    const conversationRef = await addDoc(collection(db, "conversations"), {
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });
    return conversationRef.id;
  } catch (error) {
    console.error("Error al crear conversación:", error);
    throw error;
  }
};
