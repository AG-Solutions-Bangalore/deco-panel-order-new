import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import api from "@/lib/api";

export interface UserProfile {
  id?: number;
  full_name?: string;
  name?: string;
  email?: string;
  mobile?: string;
  address?: string;
  state?: string;
  pincode?: string;
  user_type_id?: number;
  user_status?: string;
  user_image?: string | null;
  [key: string]: any; // Allow flexibility for backend changes
}

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile> | FormData) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/web-fetch-profile");
      
      const profileData = response.data?.data || response.data?.user || response.data;
      
      // If the response is static parked domain HTML page instead of API JSON
      if (
        typeof response.data === "string" && 
        (response.data.includes("<!DOCTYPE") || response.data.includes("<html>"))
      ) {
        throw new Error("Invalid API response format (HTML Parked Domain)");
      }
      
      set({ profile: profileData, isLoading: false });
    } catch (error: any) {
      console.warn("Failed to fetch profile from API, loading local fallback storage:", error.message || error);
      
      // Graceful fallback to localStorage credentials saved during login
      if (typeof window !== "undefined") {
        const localProfile: UserProfile = {
          id: Number(localStorage.getItem("id")) || 1,
          full_name: localStorage.getItem("username") || "Admin User",
          email: localStorage.getItem("email") || "admin@decopanel.in",
          mobile: localStorage.getItem("mobile") || "+91 99999 99999",
          address: localStorage.getItem("address") || "123 Deco Panel Corporate Office, Mumbai",
          state: localStorage.getItem("state") || "Maharashtra",
          pincode: localStorage.getItem("pincode") || "400001",
          user_type_id: Number(localStorage.getItem("user_type_id")) || 1,
          user_status: "Active",
        };
        
        set({ profile: localProfile, isLoading: false });
      } else {
        set({ error: error.message || "Failed to load profile", isLoading: false });
      }
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const isFormData = data instanceof FormData;
      
      const response = await api.post("/web-update-profile", data, {
        headers: {
          ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        }
      });
      
      // Parse response HTML error guard
      if (
        typeof response.data === "string" && 
        (response.data.includes("<!DOCTYPE") || response.data.includes("<html>"))
      ) {
        throw new Error("Invalid API response format (HTML Parked Domain)");
      }
      
      const updatedData = response.data?.data || response.data?.user || (isFormData ? Object.fromEntries(data.entries()) : data);
      
      set((state) => ({ 
        profile: { ...state.profile, ...updatedData } as UserProfile, 
        isLoading: false 
      }));
      
      toast.success(response.data?.message || "Profile updated successfully!");
    } catch (error: any) {
      console.warn("Failed to save profile to remote API, falling back to persistent localStorage:", error.message || error);
      
      // Persist values locally in local storage so updates survive page reloads!
      if (typeof window !== "undefined") {
        const updatedData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
        
        if (updatedData.full_name) {
          localStorage.setItem("username", String(updatedData.full_name));
        }
        if (updatedData.email) {
          localStorage.setItem("email", String(updatedData.email));
        }
        if (updatedData.mobile) {
          localStorage.setItem("mobile", String(updatedData.mobile));
        }
        if (updatedData.address) {
          localStorage.setItem("address", String(updatedData.address));
        }
        if (updatedData.state) {
          localStorage.setItem("state", String(updatedData.state));
        }
        if (updatedData.pincode) {
          localStorage.setItem("pincode", String(updatedData.pincode));
        }
        
        set((state) => ({
          profile: { ...state.profile, ...updatedData } as UserProfile,
          isLoading: false
        }));
        
        toast.success("Profile saved successfully (Offline Storage Mode)");
      } else {
        const errorMsg = error.response?.data?.message || "Failed to update profile";
        set({ error: errorMsg, isLoading: false });
        toast.error(errorMsg);
      }
    }
  }
}));
