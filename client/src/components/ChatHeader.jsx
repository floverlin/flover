import { ChevronLeft, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { avatarPath } from "../lib/utils";
import { useNavigate } from "react-router";

export default function ChatHeader() {
  const { selectedChat } = useChatStore();
  const { onlineChats } = useAuthStore();
  const navigate = useNavigate();

  function closeChat() {
    navigate("/");
  }

  return (
    <div className="py-1.5 px-4 border-b border-accent/30">
      <div className="flex items-center">
        <button
          className="flex items-center justify-center md:hidden hover:cursor-pointer mr-4"
          onClick={closeChat}
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={avatarPath(selectedChat.avatar)} alt="avatar" />
            </div>
          </div>

          <div className="flex flex-col justify-around h-full">
            <div className="font-medium">{selectedChat.username}</div>
            <div className="text-sm text-base-content/70">
              {selectedChat.isTyping != null && selectedChat.isTyping
                ? "Пишет..."
                : onlineChats.includes(selectedChat._id)
                ? "В сети"
                : "Не в сети"}
            </div>
          </div>
        </div>

        <button
          className="hidden md:inline ml-auto hover:cursor-pointer"
          onClick={closeChat}
        >
          <X />
        </button>
      </div>
    </div>
  );
}
