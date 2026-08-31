import type { Employee, Patient } from "../../utils";
import { BS_MONTHS_EN, BS_MONTHS_NP, toBsDate } from "../../utils";

/**
 * Pure derivations for the dashboard. The API has no aggregate endpoint, so the
 * dashboard reads the company's employee and patient lists once and computes
 * everything here.
 */

export const TREND_MONTHS = 6;

export type TrendPoint = {
  /** `YYYY-M` — stable key for the AD month bucket. */
  key: string;
  adLabel: string;
  bsLabel: string;
  patients: number;
  employees: number;
};

export type BreakdownItem = {
  label: string;
  count: number;
};

export type RecentRegistration = {
  id: string;
  name: string;
  detail: string;
  kind: "patient" | "employee";
  avatarUrl?: string;
  registeredAt: Date;
};

export type DashboardStats = {
  totalEmployees: number;
  activeEmployees: number;
  newEmployeesThisMonth: number;
  totalPatients: number;
  activePatients: number;
  newPatientsThisMonth: number;
  /** People (staff + patients) who can sign in to the portal. */
  portalAccounts: number;
  totalPeople: number;
  trend: TrendPoint[];
  /** Cumulative headcount at the end of each trend month — for sparklines. */
  employeeSparkline: number[];
  patientSparkline: number[];
  specializations: BreakdownItem[];
  recent: RecentRegistration[];
};

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

const isActive = (status?: string) => status?.toLowerCase() === "active";

/** `created_at` is optional and can arrive unparseable — treat those as unknown. */
const toValidDate = (value?: Date | string) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const fullName = (person: { first_name?: string; last_name?: string }) =>
  `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim() || "Unnamed";

/** The last `TREND_MONTHS` AD months, oldest first, ending with `today`. */
const buildMonthBuckets = (today: Date) =>
  Array.from({ length: TREND_MONTHS }, (_, index) => {
    const start = new Date(
      today.getFullYear(),
      today.getMonth() - (TREND_MONTHS - 1 - index),
      1
    );
    const bs = toBsDate(start);

    return {
      key: monthKey(start),
      start,
      adLabel: start.toLocaleString("en-US", { month: "short" }),
      // The AD month straddles two BS months; label it with the one it opens in.
      bsLabel: bs
        ? `${BS_MONTHS_EN[bs.month]} · ${BS_MONTHS_NP[bs.month]}`
        : "",
      patients: 0,
      employees: 0,
    };
  });

const topBreakdown = (
  values: (string | undefined)[],
  limit: number
): BreakdownItem[] => {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const label = value?.trim();
    if (!label) return;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
};

export const buildDashboardStats = (
  employees: Employee[],
  patients: Patient[],
  today = new Date()
): DashboardStats => {
  const buckets = buildMonthBuckets(today);
  const bucketIndex = new Map(
    buckets.map((bucket, index) => [bucket.key, index])
  );
  const currentKey = monthKey(today);

  // Fills the trend buckets in place and reports the two figures that live
  // outside them: this month's intake, and everything older than the window
  // (which the sparkline's running total has to start from).
  const countInto = (
    people: { created_at?: Date }[],
    field: "employees" | "patients"
  ) => {
    let beforeWindow = 0;
    let thisMonth = 0;

    people.forEach((person) => {
      const created = toValidDate(person.created_at);
      if (!created) return;

      const key = monthKey(created);
      if (key === currentKey) thisMonth += 1;

      const index = bucketIndex.get(key);
      if (index === undefined) {
        if (created < buckets[0].start) beforeWindow += 1;
        return;
      }
      buckets[index][field] += 1;
    });

    return { beforeWindow, thisMonth };
  };

  const employeeCounts = countInto(employees, "employees");
  const patientCounts = countInto(patients, "patients");

  const runningTotals = (start: number, field: "employees" | "patients") => {
    let running = start;
    return buckets.map((bucket) => {
      running += bucket[field];
      return running;
    });
  };

  const dated: (Omit<RecentRegistration, "registeredAt"> & {
    registeredAt: Date | null;
  })[] = [
    ...employees.map((employee) => ({
      id: `employee-${employee.id}`,
      name: fullName(employee),
      detail: employee.specialization?.trim() || "Care staff",
      kind: "employee" as const,
      avatarUrl: employee.avatar?.url,
      registeredAt: toValidDate(employee.created_at),
    })),
    ...patients.map((patient) => ({
      id: `patient-${patient.id}`,
      name: fullName(patient),
      detail: patient.patient_id ? `ID ${patient.patient_id}` : "Patient",
      kind: "patient" as const,
      avatarUrl: patient.avatar?.url,
      registeredAt: toValidDate(patient.created_at),
    })),
  ];

  const recent: RecentRegistration[] = dated
    .flatMap((entry) =>
      entry.registeredAt ? [{ ...entry, registeredAt: entry.registeredAt }] : []
    )
    .sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime())
    .slice(0, 6);

  const portalAccounts =
    employees.filter((employee) => employee.has_account).length +
    patients.filter((patient) => patient.has_account).length;

  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((employee) => isActive(employee.status))
      .length,
    newEmployeesThisMonth: employeeCounts.thisMonth,
    totalPatients: patients.length,
    activePatients: patients.filter((patient) => isActive(patient.status))
      .length,
    newPatientsThisMonth: patientCounts.thisMonth,
    portalAccounts,
    totalPeople: employees.length + patients.length,
    trend: buckets.map(
      ({ key, adLabel, bsLabel, patients: p, employees: e }) => ({
        key,
        adLabel,
        bsLabel,
        patients: p,
        employees: e,
      })
    ),
    employeeSparkline: runningTotals(employeeCounts.beforeWindow, "employees"),
    patientSparkline: runningTotals(patientCounts.beforeWindow, "patients"),
    specializations: topBreakdown(
      employees.map((employee) => employee.specialization),
      5
    ),
    recent,
  };
};
