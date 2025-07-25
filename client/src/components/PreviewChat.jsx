import { Check, CheckCheck, Send } from "lucide-react";
import React from "react";
import { avatarPath } from "../lib/utils";

const PREVIEW_MESSAGES = [
  {
    id: 2,
    content: "Worse than just bad. As always, by the way.",
    isSent: false,
    readed: false,
    createdAt: "7:00",
  },
  {
    id: 1,
    content: "Hey! How are you?",
    isSent: true,
    readed: true,
    createdAt: "6:21",
  },
];

export default function PreviewChat() {
  return (
    <div className="w-full rounded-xl border border-base-300 bg-base-200 mb-4 p-4">
      <div className="flex flex-col bg-base-100 border border-base-300 shadow-lg">
        <div className="flex items-center px-4 py-3 border-b border-accent/30 bg-accent/10">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={avatarPath()} alt="mock-avatar" />
            </div>
          </div>
          <div className="flex flex-col gap-1 ml-4">
            <h3 className="font-medium text-sm">Лин Дрейн</h3>
            <p className="text-xs text-base-content/70">В сети</p>
          </div>
        </div>

        <div className="flex flex-col-reverse p-4 h-48 bg-accent/10">
          {PREVIEW_MESSAGES.map((message) => (
            <div
              key={message.id}
              className={`chat ${message.isSent ? "chat-end" : "chat-start"}`}
            >
              <div
                className={`chat-bubble ${
                  message.isSent
                    ? "chat-bubble-primary"
                    : "chat-bubble-secondary"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="flex text-[10px] mt-1.5 ">
                  {message.createdAt}
                  <div className="flex w-full justify-end items-center">
                    {message.isSent ? (
                      message.readed ? (
                        <CheckCheck className="size-4" />
                      ) : (
                        <Check className="size-4" />
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full p-4 border-t-2 border-accent/30 bg-accent/20 flex gap-2">
          <input
            type="text"
            className="input input-bordered w-full text-sm h-10"
            placeholder="Напишите сообщение..."
            readOnly
          />
          <button className="btn btn-primary h-10">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
