import { ChevronLeft, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { avatarPath } from "../lib/utils";

export default function ChatHeader() {
  const { selectedChat, setSelectedChat } = useChatStore();
  const { onlineChats } = useAuthStore();

  return (
    <div className="p-1.5 px-4 border-b border-accent/30">
      <div className="flex items-center gap-4">
        <button
          className="flex items-center justify-center md:hidden hover:cursor-pointer"
          onClick={() => setSelectedChat(null)}
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={avatarPath(selectedChat.avatar)} alt="avatar" />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedChat.username}</h3>
            <p className="text-sm text-base-content/70">
              {selectedChat.isTyping != null && selectedChat.isTyping
                ? "Пишет..."
                : onlineChats.includes(selectedChat._id)
                ? "В сети"
                : "Не в сети"}
            </p>
          </div>
        </div>

        <button
          className="hidden md:inline ml-auto hover:cursor-pointer"
          onClick={() => setSelectedChat(null)}
        >
          <X />
        </button>
      </div>
    </div>
  );
}
