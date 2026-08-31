/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Employee, Patient } from "../../utils";
import { parseEmployeeResponse, parsePatientResponse } from "../../utils";
import { getAllEmployeesOfACompany } from "../employee/employeeApi";
import { getAllPatientsOfACompany } from "../patient/patientApi";
import { buildDashboardStats, type DashboardStats } from "./dashboardStats";

type DashboardData = {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

const EMPTY_EMPLOYEES: Employee[] = [];
const EMPTY_PATIENTS: Patient[] = [];

/**
 * Loads the company-scoped roster the dashboard is built from. There is no
 * aggregate stats endpoint, so both lists are fetched once and reduced locally.
 */
export const useDashboardData = (companyId?: number): DashboardData => {
  const [employees, setEmployees] = useState<Employee[]>(EMPTY_EMPLOYEES);
  const [patients, setPatients] = useState<Patient[]>(EMPTY_PATIENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!companyId) {
      setEmployees(EMPTY_EMPLOYEES);
      setPatients(EMPTY_PATIENTS);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [employeeResponse, patientResponse] = await Promise.all([
        getAllEmployeesOfACompany(companyId),
        getAllPatientsOfACompany(companyId),
      ]);

      setEmployees(parseEmployeeResponse(employeeResponse));
      setPatients(parsePatientResponse(patientResponse));
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data");
      setEmployees(EMPTY_EMPLOYEES);
      setPatients(EMPTY_PATIENTS);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(
    () => buildDashboardStats(employees, patients),
    [employees, patients]
  );

  return { stats, loading, error, reload: load };
};
