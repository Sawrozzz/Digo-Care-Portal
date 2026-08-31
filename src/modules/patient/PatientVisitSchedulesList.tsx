/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarRange } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { DegoTable } from "../../components/custom/DegoTable";
import { getAllEmployeesOfACompany } from "../employee/employeeApi";
import { getAllPatientAssignments } from "../patientAssignment/patientAssignmentApi";
import { getAllVisitSchedules } from "../visitSchedule/visitScheduleApi";
import {
  parseEmployeeResponse,
  parsePatientAssignmentResponse,
  parseVisitScheduleResponse,
} from "../../utils/appUtils";
import type { VisitSchedule } from "../../utils";
import {
  FALLBACK_BADGE_STYLE,
  VISIT_MODE_STYLES,
  VISIT_PRIORITY_STYLES,
  VISIT_STATUS_STYLES,
  VISIT_TYPE_STYLES,
  formatDuration,
  formatVisitDateTime,
  formatVisitTime,
} from "../visitSchedule/visitScheduleAttributes";

interface Props {
  companyId: number;
  patientId: number;
}

const humanize = (v?: string) => (v || "").replace(/_/g, " ");

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
    {children}
  </div>
);

const columns: ColumnDef<VisitSchedule>[] = [
  {
    accessorKey: "visit_code",
    header: "Visit",
    cell: ({ row }) => (
      <p className="font-mono text-xs text-gray-600">
        {row.original.visit_code || `VS-#${row.original.id}`}
      </p>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <p className="font-medium text-gray-900">{row.original.title || "—"}</p>
        {row.original.description && (
          <p className="max-w-[16rem] truncate text-xs text-gray-500">
            {row.original.description}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "employee_name",
    header: "Doctor",
    cell: ({ row }) => {
      const e: any = (row.original as any).employee;
      const name =
        (row.original as any).employee_name ||
        `${e?.first_name ?? ""} ${e?.last_name ?? ""}`.trim();
      const email = e?.email;
      return (
        <div className="flex flex-col">
          <p className="text-gray-900">{name || "—"}</p>
          {email && <p className="text-xs text-gray-500">{email}</p>}
        </div>
      );
    },
  },
  {
    accessorKey: "scheduled_start_at",
    header: "Scheduled",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <p className="text-gray-900">
          {formatVisitDateTime(row.original.scheduled_start_at)}
        </p>
        <p className="text-xs text-gray-500">
          {row.original.day_of_week ? `${row.original.day_of_week} · ` : ""}
          until {formatVisitTime(row.original.scheduled_end_at)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "duration_minutes",
    header: "Duration",
    cell: ({ row }) => <p>{formatDuration(row.original.duration_minutes)}</p>,
  },
  {
    accessorKey: "visit_type",
    header: "Type",
    cell: ({ row }) => {
      const v = (row.original.visit_type || "").toLowerCase();
      return (
        <Badge variant="outline" className={`capitalize px-2 py-1 text-xs ${VISIT_TYPE_STYLES[v] || FALLBACK_BADGE_STYLE}`}>
          {humanize(v) || "—"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "visit_mode",
    header: "Mode",
    cell: ({ row }) => {
      const v = (row.original.visit_mode || "").toLowerCase();
      return (
        <Badge variant="outline" className={`capitalize px-2 py-1 text-xs ${VISIT_MODE_STYLES[v] || FALLBACK_BADGE_STYLE}`}>
          {humanize(v) || "—"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const v = (row.original.priority || "").toLowerCase();
      return (
        <Badge variant="outline" className={`capitalize px-2 py-1 text-xs ${VISIT_PRIORITY_STYLES[v] || FALLBACK_BADGE_STYLE}`}>
          {humanize(v) || "—"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const v = (row.original.status || "").toLowerCase();
      return (
        <Badge variant="outline" className={`capitalize px-2 py-1 text-xs ${VISIT_STATUS_STYLES[v] || FALLBACK_BADGE_STYLE}`}>
          {humanize(v) || "—"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const { location, meeting_link } = row.original;
      if (meeting_link)
        return (
          <a href={meeting_link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline underline-offset-2">
            Join link
          </a>
        );
      return <p className="text-sm text-gray-600">{location || "—"}</p>;
    },
  },
];

export default function PatientVisitSchedulesList({ companyId, patientId }: Props) {
  const [visits, setVisits] = useState<VisitSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchVisits = useCallback(async () => {
    if (!companyId || !patientId) return;
    const reqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const empRes = await getAllEmployeesOfACompany(companyId);
      if (reqId !== requestIdRef.current) return;
      const employees = parseEmployeeResponse(empRes);
      if (!employees.length) {
        setVisits([]);
        return;
      }
      const assignmentsPerEmployee = await Promise.all(
        employees.map(async (emp) => {
          try {
            const res = await getAllPatientAssignments(companyId, Number(emp.id));
            const list = parsePatientAssignmentResponse(res);
            const matched = list.filter((a: any) => Number(a.patient?.id) === Number(patientId));
            return matched.map((a: any) => ({ employeeId: Number(emp.id), assignmentId: Number(a.id) }));
          } catch {
            return [];
          }
        })
      );
      if (reqId !== requestIdRef.current) return;
      const matchedAssignments = assignmentsPerEmployee.flat();
      if (!matchedAssignments.length) {
        setVisits([]);
        return;
      }
      const visitsPerAssignment = await Promise.all(
        matchedAssignments.map(async ({ employeeId, assignmentId }) => {
          try {
            const res = await getAllVisitSchedules(companyId, employeeId, assignmentId);
            return parseVisitScheduleResponse(res);
          } catch {
            return [];
          }
        })
      );
      if (reqId !== requestIdRef.current) return;
      const merged = visitsPerAssignment.flat().sort((a: any, b: any) => {
        const da = new Date(a.scheduled_start_at as any).getTime();
        const db = new Date(b.scheduled_start_at as any).getTime();
        return db - da;
      });
      setVisits(merged);
    } catch (err: any) {
      if (reqId !== requestIdRef.current) return;
      setError(err?.message || "Failed to load visit schedules");
      setVisits([]);
    } finally {
      if (reqId === requestIdRef.current) setLoading(false);
    }
  }, [companyId, patientId]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const memoCols = useMemo(() => columns, []);

  if (loading) return <Shell>Loading visit schedules...</Shell>;
  if (error)
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center text-sm text-red-600 shadow-sm">
        {error}
      </div>
    );
  if (!visits.length)
    return (
      <Shell>
        <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
          <CalendarRange size={22} />
        </span>
        <h3 className="font-semibold text-gray-900">No visits scheduled</h3>
        <p className="mt-1 text-sm text-gray-500">Visit schedules of the employees assigned to this patient will show up here.</p>
      </Shell>
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <DegoTable columns={memoCols} data={visits as any} searchKey="title" placeholder="Search visits..." />
    </div>
  );
}
