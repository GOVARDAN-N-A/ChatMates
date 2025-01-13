import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib.js";
import toast from "react-hot-toast";
// import { use } from "react";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "Failed to fetch users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (UserId) => {
    set({ isMessagesLoading: true });
    try {

      const res = await axiosInstance.get(`/messages/${UserId}`);
      console.log( " Response data from getMessages (useChatStore)",res.data);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get(); // Use get() correctly here
    if (!selectedUser) {
      toast.error("No selected user");
      return;
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      console.log(" Response data from sendMessage (useChatStore)",res.data);
      
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));
