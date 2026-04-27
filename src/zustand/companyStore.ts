/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/axios";

import {
  parseCompanyResponse,
  parseSingleCompanyData,
  type Company,
} from "../utils";

type CompanyState = {
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: (company: Company) => void;
  loading: boolean;
  error: string | null;
  initializeCompanies: (
    role: string,
    companyId?: number | null
  ) => Promise<void>;
  getAllCompanies: () => Promise<void>;
  getSingleCompany: (id: number) => Promise<void>;
  setCompaniesFromApi: (rawApiResponse: any) => void;
};

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companies: [],
      loading: false,
      error: null,
      activeCompany: null,

      setActiveCompany: (company) => set({ activeCompany: company }),

      setCompaniesFromApi: (rawApiResponse: any) => {
        const cleanCompanies = parseCompanyResponse(rawApiResponse);
        const current = get().activeCompany;

        const restored = cleanCompanies.find((c) => c.id === current?.id);

        set({
          companies: cleanCompanies,
          activeCompany: restored || cleanCompanies[0] || null,
          loading: false,
        });
      },

      initializeCompanies: async (role, companyId) => {
        set({ loading: true, error: null });

        try {
          if (role === "super_admin") {
            const response = await apiClient.get("/companies");
            const cleanList = parseCompanyResponse(response.data);

            const current = get().activeCompany;

            const restored = cleanList.find((c) => c.id === current?.id);

            set({
              companies: cleanList,
              activeCompany: restored || cleanList[0] || null,
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
            error:
              err.response?.data?.message || "Failed to initialize companies",
            loading: false,
          });
        }
      },

      getAllCompanies: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.get("/companies");
          const cleanList = parseCompanyResponse(response.data);

          const current = get().activeCompany;

          const restored = cleanList.find((c) => c.id === current?.id);

          set({
            companies: cleanList,
            activeCompany: restored || cleanList[0] || null,
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
    }),
    {
      name: "company-storage", // localStorage key
      partialize: (state) => ({
        activeCompany: state.activeCompany, // only persist this
      }),
    }
  )
);
