/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import apiClient from "../api/axios";

import { parseEmployeeResponse, type Employee } from "../utils";

type EmployeeState = {
  employees: Employee[];
  activeEmployee: Employee | null;
  loading: boolean;
  error: string | null;
  /** company the current `employees` list belongs to */
  loadedCompanyId: number | null;
  setActiveEmployee: (employee: Employee) => void;
  initializeEmployees: (companyId: number) => Promise<void>;
};

/**
 * Tracks the fetch that is currently in flight so that repeated calls for the
 * same company (StrictMode double effects, re-mounts, parent re-renders) share
 * one request instead of each triggering their own set() storm.
 */
let inFlight: { companyId: number; promise: Promise<void> } | null = null;

export const useEmployeeStore = create<EmployeeState>()((set, get) => ({
  employees: [],
  loading: false,
  error: null,
  activeEmployee: null,
  loadedCompanyId: null,

  setActiveEmployee: (employee) =>
    set((state) =>
      state.activeEmployee?.id === employee.id
        ? state
        : { activeEmployee: employee }
    ),

  initializeEmployees: async (companyId) => {
    const state = get();

    // already loaded for this company - nothing to do
    if (state.loadedCompanyId === companyId && !state.error) return;

    // same company already being fetched - reuse that request
    if (inFlight?.companyId === companyId) return inFlight.promise;

    const promise = (async () => {
      set({ loading: true, error: null });

      try {
        const response = await apiClient.get(
          `/companies/${companyId}/employees`
        );
        const cleanList = parseEmployeeResponse(response.data);
        // console.log("Employee list", cleanList)

        // only keep the current selection when it belongs to the same company
        const state = get();
        const current =
          state.loadedCompanyId === companyId ? state.activeEmployee : null;
        const restored = cleanList.find((e) => e.id === current?.id);

        set({
          employees: cleanList,
          activeEmployee: restored || cleanList[0] || null,
          loadedCompanyId: companyId,
          loading: false,
        });
      } catch (err: any) {
        set({
          employees: [],
          activeEmployee: null,
          loadedCompanyId: null,
          error: err.response?.data?.message || "Failed to initialize employees",
          loading: false,
        });
      } finally {
        if (inFlight?.companyId === companyId) inFlight = null;
      }
    })();

    inFlight = { companyId, promise };
    return promise;
  },
}));
