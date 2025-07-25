import React from "react";
import { useChatStore } from "../store/useChatStore";
import Chatbar from "../components/Chatbar";
import Chat from "../components/Chat";
import NoChat from "../components/NoChat";
import { useEffect } from "react";
import NoScroll from "../components/NoScroll";

export default function HomePage() {
  const { selectedChat } = useChatStore();
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

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
