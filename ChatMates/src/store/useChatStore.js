import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib.js";
import toast from "react-hot-toast";

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
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message || "Failed to send message");
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));
