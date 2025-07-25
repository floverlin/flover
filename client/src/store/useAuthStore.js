import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingAvatar: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineChats: [],
  socket: null,

  updateAvatar: async (data) => {
    set({ isUpdatingAvatar: true });
    try {
      const responce = await axiosInstance.put("/user/update-avatar", data);
      toast.success("Аватар успешно обновлен");
      set({ authUser: responce.data });
    } catch (error) {
      console.error(`Update avatar: ${error}`);
      toast.error(`Ошибка обновления аватара`);
    } finally {
      set({ isUpdatingAvatar: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const responce = await axiosInstance.put("/user/update-profile", data);
      toast.success("Профиль успешно обновлен");
      set({ authUser: responce.data });
    } catch (error) {
      console.error(`Update profile: ${error}`);
      toast.error(`Ошибка обновления профиля`);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  checkAuth: async () => {
    try {
      const responce = await axiosInstance.get("/auth/me");
      set({ authUser: responce.data });
      get().connectSocket();
    } catch (error) {
      console.error(`Check auth: ${error}`);
      // toast.error(`Ошибка аутентификации`) // unused
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const responce = await axiosInstance.post("/auth/login", data);
      toast.success("Успешный вход");
      set({ authUser: responce.data });
      get().connectSocket();
    } catch (error) {
      console.error(`Login: ${error}`);
      toast.error(`Ошибка входа`);
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const responce = await axiosInstance.post("/auth/signup", data);
      toast.success("Аккаунт успешно создан");
      set({ authUser: responce.data });
      get().connectSocket();
    } catch (error) {
      console.error(`Signup: ${error}`);
      toast.error(`Ошибка регистрации`);
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Успешный выход");
      get().disconnectSocket();
    } catch (error) {
      console.error(`Logout: ${error}`);
      toast.error(`Ошибка выхода`);
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    try {
      const socket = io({ query: { userID: authUser._id } });
      socket.connect();
      set({ socket });

      socket.on("x-online", (chatIDs) => set({ onlineChats: chatIDs }));

      socket.on("x-typing", ({ chatID, isTyping }) => {
        const { selectedChat, chats } = useChatStore.getState();
        if (chatID.toString() === selectedChat?._id) {
          selectedChat.isTyping = isTyping;
          set({ selectedChat });
        }
        const chat = chats.find((chat) => {
          return chat.user._id === chatID;
        });
        if (chat) chat.isTyping = isTyping;
        set({ chats });
      });
    } catch (error) {
      console.error(`Connect socket: ${error}`);
      toast.error(`Ошибка веб сокета`);
    }
  },
  disconnectSocket: () => {
    if (!get().socket?.connected) return;
    get().socket.disconnect();
  },
}));
