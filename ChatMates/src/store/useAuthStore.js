import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib.js";
import toast from "react-hot-toast";
// import { updateProfile } from "../../../Server/src/controllers/auth.controllers.js";
// import * as jwt_decode from "jwt-decode";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,


  checkAuth: async () => {
    try {
        const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      if (error.response.status === 404) {
        console.log("The /api/auth/check endpoint does not exist.");
      } else {
        console.log("Error in checkAuth:", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },


  login: async (data) => {
    try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
        get().connectSocket();
    } catch (error) {
        toast.error(error.response.data.message);
    }
    finally {
        set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true});

    try {
         const res = await axiosInstance.put("/auth/update-profile", data)
         set({ authUser: res.data });
         toast.success("Profile updated successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
    finally {
        set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    // implement your socket connection logic here
  },

  disconnectSocket: () => {
    // implement your socket disconnection logic here
  },
}));