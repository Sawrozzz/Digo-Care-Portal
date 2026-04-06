/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import apiClient from "../api/axios";

type Account = {
  id: number;
  email: string;
  profile_type?: string;
  profile_id?: number;
  role: string;
  company_id: number | null;
};

type AuthState = {
  account: Account | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  account: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.post("/login", {
        account: { email, password },
      });

      const authHeader = response.headers["authorization"];
      const token = authHeader?.split(" ")[1];

      if (token) {
        localStorage.setItem("token", token);
      }

      const account = response.data?.data || response?.data;

      set({ account, token, isAuthenticated: true, loading: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed";
      set({
        error: message,
        loading: false,
      });
      throw new Error(message);
    }
  },
  logout: async () => {
    try {
      await apiClient.delete("/logout");
    } catch (error: any) {
      console.log(error);
    } finally {
      localStorage.removeItem("token");
      set({
        account: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));
