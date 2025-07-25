import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { playAlert } from "../lib/utils";

export const useChatStore = create((set, get) => ({
  messages: [],
  chats: [],
  selectedChat: null,
  isChatsLoading: false,
  isMessagesLoading: false,

  typing: (chatID, isTyping) => {
    const { socket } = useAuthStore.getState();
    socket.emit("f-typing", { chatID, isTyping });
  },

  getChats: async () => {
    set({ isChatsLoading: true });
    try {
      const responce = await axiosInstance.get("/messages/chats");
      set({ chats: responce.data });
    } catch (error) {
      console.error(`Get chats: ${error}`);
      toast.error(`Ошибка загрузки чатов`);
    } finally {
      set({ isChatsLoading: false });
    }
  },

  markMessageReaded: async (message) => {
    try {
      await axiosInstance.put(`/messages/mark-readed`, { message });
      const chats = get().chats;
      const chat = chats.find((chat) => {
        return chat.user._id === message.senderID;
      });
      if (chat.unreaded > 0) chat.unreaded -= 1;
      set({ chats });
    } catch (error) {
      console.error(`Mark chat readed: ${error}`);
      toast.error(`Ошибка чата`);
    }
  },

  getFilteredGlobalChats: async (filter) => {
    set({ isChatsLoading: true });
    try {
      const params = new URLSearchParams();
      params.append("filter", filter);
      const responce = await axiosInstance.get(
        `/messages/chats-global?${params}`
      );
      set({ chats: responce.data });
    } catch (error) {
      console.error(`Get global chats: ${error}`);
      toast.error(`Ошибка загрузки чатов`);
    } finally {
      set({ isChatsLoading: false });
    }
  },

  getMessages: async (chatID, offset = 0, limit = 80) => {
    set({ isMessagesLoading: true });
    try {
      const params = new URLSearchParams();
      params.append("offset", offset);
      params.append("limit", limit);
      const responce = await axiosInstance.get(`/messages/${chatID}`, {
        params,
      });
      if (offset > 0) {
        set({ messages: [...get().messages, ...responce.data] });
      } else {
        set({ messages: responce.data });
      }
    } catch (error) {
      console.error(`Get messages: ${error}`);
      toast.error(`Ошибка загрузки сообщений`);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  sendMessage: async (messageData) => {
    const { selectedChat, messages } = get();
    try {
      const responce = await axiosInstance.post(
        `/messages/send/${selectedChat._id}`,
        messageData
      );
      set({
        messages: [responce.data, ...messages],
        chats: await updateChats(get, responce.data),
      });
    } catch (error) {
      console.error(`Send message: ${error}`);
      toast.error(`Ошибка отправки сообщения`);
    }
  },

  subscribeToMessages: () => {
    const { socket } = useAuthStore.getState();

    socket.on("x-message", async (message) => {
      playAlert();
      if (message.senderID === get().selectedChat?._id) {
        set({ messages: [message, ...get().messages] });
      } else {
        const chats = get().chats;
        const chat = chats.find((chat) => {
          return chat.user._id === message.senderID;
        });
        if (chat) chat.unreaded += 1;
        set({ chats });
      }
      set({ chats: await updateChats(get, message) });
    });

    socket.on("x-readed", async (message) => {
      if (message.recieverID !== get().selectedChat?._id) return;
      const messagesInChat = get().messages;
      const updatedMessage = messagesInChat.find((messageInChat) => {
        return message._id === messageInChat._id;
      });
      updatedMessage.readedAt = message.readedAt;
      set({ messages: messagesInChat });
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    socket.off("x-message");
  },
}));

async function updateChats(get, newMessage) {
  const chats = get().chats;
  let chatToUpdate = chats.find(
    (chat) =>
      chat.user._id === newMessage.senderID ||
      chat.user._id === newMessage.recieverID
  );

  // new chat
  if (!chatToUpdate) {
    const { authUser } = useAuthStore.getState();
    const responce = await axiosInstance(
      `/messages/chat/${
        newMessage.senderID === authUser._id
          ? newMessage.recieverID
          : newMessage.senderID
      }`
    );
    chatToUpdate = responce.data;
    chats.push(chatToUpdate);
  }

  chatToUpdate.lastMessage = newMessage;
  chats.sort(
    (f, s) =>
      Date.parse(s.lastMessage.createdAt) - Date.parse(f.lastMessage.createdAt)
  );
  return chats;
}
