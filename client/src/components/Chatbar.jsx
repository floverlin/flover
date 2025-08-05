import React from "react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { Globe, Image, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { avatarPath, formatTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useRef } from "react";
import ChatSearch from "./ChatSearch";
import { useNavigate } from "react-router";
import Scroller from "./Scroller";
import Writing from "./Writing";

export default function Chatbar() {
  const getChats = useChatStore((state) => state.getChats);
  const getFilteredGlobalChats = useChatStore(
    (state) => state.getFilteredGlobalChats
  );
  const chats = useChatStore((state) => state.chats);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const isChatsLoading = useChatStore((state) => state.isChatsLoading);
  const onlineChats = useAuthStore((state) => state.onlineChats);

  const [filterValue, setFilterValue] = useState("");
  const filterTimeoutRef = useRef(null);
  const chatSearchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (filterValue === "") {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
        filterTimeoutRef.current = null;
      }
      getChats();
      return;
    }
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    filterTimeoutRef.current = setTimeout(() => {
      getFilteredGlobalChats(filterValue).then(() => {
        //if (chatSearchRef.current) chatSearchRef.current.focus();
      });
    }, 500);
  }, [filterValue, getChats, getFilteredGlobalChats]);

  useEffect(() => {
    getChats();
  }, [getChats]);

  function openChat(chat) {
    navigate(`/${chat.user._id}`);
    setFilterValue("");
  }

  if (isChatsLoading)
    // if (true)
    return (
      <aside className="w-full h-full flex flex-col border-r border-base-300">
        <ChatSearch disabled={true} />
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="size-12 animate-spin text-primary" />
        </div>
      </aside>
    );

  return (
    <aside className="w-full h-full flex flex-col border-r border-base-300">
      <ChatSearch
        ref={chatSearchRef}
        value={filterValue}
        onChange={(e) => {
          setFilterValue(e.target.value);
        }}
      />

      <Scroller>
        {chats.map((chat) => (
          <button
            key={chat.user._id}
            onClick={() => openChat(chat)}
            className={`w-full h-20 py-2 px-3 flex items-center hover:bg-base-200 hover:cursor-pointer transition-colors border-b border-base-300 relative ${
              selectedChat?._id === chat.user._id ? "bg-base-200" : ""
            }`}
          >
            <div className="avatar relative">
              <div className="w-14 rounded-full">
                <img src={avatarPath(chat.user.avatar)} alt="avatar" />
              </div>
              {onlineChats.includes(chat.user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-accent rounded-full ring-2 ring-base-100" />
              )}
            </div>

            <div className="h-full flex flex-col items-start justify-around ml-6 pr-8 overflow-hidden">
              <div className="font-medium truncate">{chat.user.username}</div>
              <div className="text-sm text-base-content/40 w-full flex items-center gap-1">
                {chat.lastMessage?.image && (
                  <Image className="size-4 flex-shrink-0" /> // TODO
                )}
                <span className="truncate">
                  {chat.isTyping != null && chat.isTyping ? (
                    <Writing text="Пишет" />
                  ) : (
                    chat.lastMessage?.text
                  )}
                </span>
              </div>
            </div>

            <div className="absolute top-1 right-2 z-10">
              <div className="text-[10px] text-base-content/60 whitespace-nowrap">
                {chat.lastMessage && formatTime(chat.lastMessage.createdAt)}
              </div>
            </div>

            {chat.unreaded && chat.unreaded > 0 ? (
              <div className="absolute bottom-3 right-4 z-10">
                <div className="text-[12px] bg-accent text-accent-content size-5 rounded-full flex items-center justify-center">
                  {chat.unreaded}
                </div>
              </div>
            ) : null}
          </button>
        ))}

        {chats.length === 0 && (
          <div className="text-center font-bold text-base-content/80 pt-8">
            Нет чатов
          </div>
        )}
      </Scroller>
    </aside>
  );
}
