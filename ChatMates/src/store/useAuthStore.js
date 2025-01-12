import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  // Check authentication status
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
      get().connectSocket(); // Connect to socket if auth user found
    } catch (error) {
      if (!error.response) {
        console.error("Network error:", error);
        toast.error("Network error, please try again later.");
      } else if (error.response.status === 404) {
        console.log("The /api/auth/check endpoint does not exist.");
      } else {
        console.error("Error in checkAuth:", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Sign up a new user
  signup: async (data) => {
    set({ isSigningUp: true });
    console.log(" Signup data from useAuthStore ",data);
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      if (!error.response) {
        toast.error("Network error during signup.");
      } else {
        toast.error(error.response.data.message || "Signup failed.");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Log in a user
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      if (!error.response) {
        toast.error("Network error during login.");
      } else {
        toast.error(error.response.data.message || "Login failed.");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Log out the user
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      if (!error.response) {
        toast.error("Network error during logout.");
      } else {
        toast.error(error.response.data.message || "Logout failed.");
      }
    }
  },

  // Update profile data
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (!error.response) {
        toast.error("Network error during profile update.");
      } else {
        toast.error(error.response.data.message || "Profile update failed.");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Connect to socket (implementation here)
  connectSocket: () => {
    // If you are using a socket server (e.g., Socket.io), you can implement the socket connection logic here
    console.log("Connecting to socket...");
  },

  // Disconnect from socket (implementation here)
  disconnectSocket: () => {
    // If you are using a socket server (e.g., Socket.io), implement disconnection logic here
    console.log("Disconnecting from socket...");
  },
}));
