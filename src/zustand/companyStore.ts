/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import apiClient from "../api/axios";

import { type Company } from "../utils";

type CompanyState = {
  companies: Company[];
  loading: boolean;
  error: string | null;
  getAllCompanies: () => Promise<void>;
};

export const companyStore = create<CompanyState>((set) => ({
  companies: [],
  loading: false,
  error: null,
  getAllCompanies: async () => {
    set({ companies: [], loading: true, error: null });

    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get("/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ companies: response.data, loading: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Fail to reterive companies.";
      set({
        error: message,
        loading: false,
      });
      throw new Error(message);
    }
  },
}));
