import React, { useLayoutEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import InputPannel from "./InputPannel";
import { useAuthStore } from "../store/useAuthStore";
import { avatarPath, formatTime, imagePath, waitAndScroll } from "../lib/utils";
import { useRef } from "react";
import { Check, CheckCheck, Loader2 } from "lucide-react";
import Scroller from "./Scroller";

export default function Chat() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedChat,
    markMessageReaded,
  } = useChatStore();
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const { authUser } = useAuthStore();
  const messageListRef = useRef(null);
  const observerRefs = useRef({});

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageID = entry.target.dataset.id;
            const message = messages.find(
              (message) => message._id === messageID
            );

            if (message.readedAt !== null || message.senderID === authUser._id)
              return;
            markMessageReaded(message);
          }
        });
      },
      {
        root: null,
        threshold: 0.8,
      }
    );

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(observerRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      observerRefs.current = {};
    };
  }, [markMessageReaded, messages, authUser]);

  useEffect(() => {
    getMessages(selectedChat._id);
  }, [selectedChat._id, getMessages]);

  useEffect(() => {
    const f = async () => {
      await waitAndScroll(messageListRef);
      setIsImagesLoading(false);
    };
    f();
  }, [messages]);

  if (isMessagesLoading || isImagesLoading)
    // if (true)
    return (
      <div className="flex flex-col w-full h-full">
        <ChatHeader />
        <div className="flex-1 w-full flex justify-center items-center">
          <Loader2 className="size-12 animate-spin text-primary" />
        </div>
        <InputPannel />
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full">
      <ChatHeader />
      <Scroller
        className="flex-1 flex flex-col-reverse p-2 md:p-4"
        ref={messageListRef}
      >
        {messages.map((message, idx) => (
          <div
            key={message._id}
            ref={(el) => (observerRefs.current[message._id] = el)}
            data-id={message._id}
            className={`chat ${
              message.senderID === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="hidden md:block chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  className={`hidden ${
                    messages[idx - 1]?.senderID !== message.senderID
                      ? "md:block"
                      : ""
                  } chat-image avatar`}
                  src={
                    message.senderID === authUser._id
                      ? avatarPath(authUser.avatar)
                      : avatarPath(selectedChat.avatar)
                  }
                  alt="avatar"
                />
              </div>
            </div>

            <div
              className={`chat-bubble flex flex-col ${
                message.senderID === authUser._id
                  ? "chat-bubble-primary"
                  : "chat-bubble-secondary"
              }`}
            >
              {message.image && (
                <a
                  href={imagePath(message.image)}
                  className="hover:cursor-pointer"
                  target="_blank"
                >
                  <img
                    src={imagePath(message.image)}
                    alt="image"
                    className="max-w-40 max-h-60 md:max-w-60 md:max-h-80 rounded-2xl mb-2 shadow-black/40 shadow-xl"
                  />
                </a>
              )}
              {message.text && (
                <p className="whitespace-normal wrap-break-word">
                  {message.text}
                </p>
              )}
              <div className="flex justify-end gap-2 opacity-60">
                <time className="text-[10px]">
                  {formatTime(message.createdAt)}
                </time>
                {message.senderID === authUser._id &&
                  (message.readedAt ? (
                    <CheckCheck className="size-4 shadow-black/40 shadow-xl" />
                  ) : (
                    <Check className="size-4 shadow-black/40 shadow-xl" />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </Scroller>
      <InputPannel />
    </div>
  );
}
