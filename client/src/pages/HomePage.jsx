import React from "react";
import { useChatStore } from "../store/useChatStore";
import Chatbar from "../components/Chatbar";
import Chat from "../components/Chat";
import NoChat from "../components/NoChat";
import { useEffect } from "react";
import NoScroll from "../components/NoScroll";
import { useParams } from "react-router";
import { axiosInstance } from "../lib/axios";

export default function HomePage() {
  const { chatID } = useParams();
  const { selectedChat, setSelectedChat } = useChatStore();
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  async function getChat(chatID) {
    try {
      const responce = await axiosInstance.get(`/messages/chat/${chatID}`);
      return responce.data.user;
    } catch (error) {
      console.error(`Get chat: ${error}`);
    }
  }

  useEffect(() => {
    if (!chatID) {
      setSelectedChat(null);
    } else {
      getChat(chatID).then((chat) => {
        if (!chat) {
          setSelectedChat(null);
        } else {
          setSelectedChat(chat);
        }
      });
    }
  }, [chatID, setSelectedChat]);

  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [subscribeToMessages, unsubscribeFromMessages]);

  return (
    <NoScroll className="flex">
      <div
        className={`w-full md:w-64 lg:w-100 flex ${
          selectedChat ? "hidden md:flex" : ""
        }`}
      >
        <Chatbar />
      </div>
      <div
        className={`w-full flex-1 flex bg-accent/10 ${
          selectedChat ? "" : "hidden md:flex"
        }`}
      >
        {selectedChat ? <Chat /> : <NoChat />}
      </div>
    </NoScroll>
  );
}
