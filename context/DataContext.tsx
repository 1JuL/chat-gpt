import { Message } from "@/interfaces/AppInterfaces";
import { createContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }: any) => {
  const [chats, setChats] = useState([] as Message[]);

  const createChat = async (text: string, messages: Message[]) => {};

  const updateChat = async (text: string, messages: Message[]) => {};

  const deleteChat = async (text: string, messages: Message[]) => {};

  const getChat = async (id: string) => {};

  return (
    <DataContext.Provider value={{ createChat, updateChat, deleteChat, getChat }}>
      {children}
    </DataContext.Provider>
  );
};
