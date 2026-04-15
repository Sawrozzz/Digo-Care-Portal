/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import apiClient from "../api/axios";

import { parseCompanyResponse, parseSingleCompanyData, type Company } from "../utils";

type CompanyState = {
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: (company: Company) => void;
  loading: boolean;
  error: string | null;
  initializeCompanies: (
    role: string,
    companyId?: number | null,
  ) => Promise<void>;
  getAllCompanies: () => Promise<void>;
  getSingleCompany: (id: number) => Promise<void>;
  setCompaniesFromApi: (rawApiResponse: any) => void;
};

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  loading: false,
  error: null,
  activeCompany: null,
  setActiveCompany: (company) => set({ activeCompany: company }),
  setCompaniesFromApi: (rawApiResponse: any) => {
    const cleanCompanies = parseCompanyResponse(rawApiResponse);
    set((state) => ({
      companies: cleanCompanies,
      activeCompany: state.activeCompany || cleanCompanies[0] || null,
      loading: false,
    }));
  },
  initializeCompanies: async (role, companyId) => {
    set({ loading: true, error: null });

    try {
      if (role === "super_admin") {
        const response = await apiClient.get("/companies");
        const cleanList = parseCompanyResponse(response.data);
        set({
          companies: cleanList,
          activeCompany: cleanList[0] || null,
          loading: false,
        });
      } else if (role === "admin" && companyId) {
        const response = await apiClient.get(`/companies/${companyId}`);
        const cleanCompany = parseSingleCompanyData(response.data);
        set({
          companies: cleanCompany ? [cleanCompany] : [],
          activeCompany: cleanCompany,
          loading: false,
        });
      }
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to initialize companies",
        loading: false,
      });
    }
  },

  getAllCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/companies");
      const cleanList = parseCompanyResponse(response.data);
      set({
        companies: cleanList,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  getSingleCompany: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/companies/${id}`);
      const cleanCompany = parseSingleCompanyData(response.data);
      set({
        activeCompany: cleanCompany,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
