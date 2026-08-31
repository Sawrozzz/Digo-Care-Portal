/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarRange } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { DegoTable } from "../../components/custom/DegoTable";
import { getAllPatientAssignments } from "../patientAssignment/patientAssignmentApi";
import { getAllVisitSchedules } from "../visitSchedule/visitScheduleApi";
import {
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
  employeeId: number;
}

const humanize = (v?: string) => (v || "").replace(/_/g, " ");

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
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
    accessorKey: "patient_name",
    header: "Patient",
    cell: ({ row }) => {
      const p: any = (row.original as any).patient;
      const name =
        (row.original as any).patient_name ||
        `${p?.first_name ?? ""} ${p?.last_name ?? ""}`.trim();
      const pid = p?.patient_id;
      return (
        <div className="flex flex-col">
          <p className="text-gray-900">{name || "—"}</p>
          {pid && <p className="text-xs text-gray-500">{pid}</p>}
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
        <Badge
          variant="outline"
          className={`capitalize px-2 py-1 text-xs ${VISIT_TYPE_STYLES[v] || FALLBACK_BADGE_STYLE}`}
        >
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
        <Badge
          variant="outline"
          className={`capitalize px-2 py-1 text-xs ${VISIT_MODE_STYLES[v] || FALLBACK_BADGE_STYLE}`}
        >
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
        <Badge
          variant="outline"
          className={`capitalize px-2 py-1 text-xs ${VISIT_PRIORITY_STYLES[v] || FALLBACK_BADGE_STYLE}`}
        >
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
        <Badge
          variant="outline"
          className={`capitalize px-2 py-1 text-xs ${VISIT_STATUS_STYLES[v] || FALLBACK_BADGE_STYLE}`}
        >
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
          <a
            href={meeting_link}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 underline underline-offset-2"
          >
            Join link
          </a>
        );
      return <p className="text-sm text-gray-600">{location || "—"}</p>;
    },
  },
];

export default function EmployeeVisitSchedulesList({
  companyId,
  employeeId,
}: Props) {
  const [visits, setVisits] = useState<VisitSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchVisits = useCallback(async () => {
    if (!companyId || !employeeId) return;
    const reqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const assignmentRes = await getAllPatientAssignments(
        companyId,
        employeeId
      );
      if (reqId !== requestIdRef.current) return;
      const assignments = parsePatientAssignmentResponse(assignmentRes);
      if (!assignments.length) {
        setVisits([]);
        return;
      }
      const results = await Promise.all(
        assignments.map(async (a: any) => {
          try {
            const res = await getAllVisitSchedules(
              companyId,
              employeeId,
              Number(a.id)
            );
            return parseVisitScheduleResponse(res);
          } catch {
            return [];
          }
        })
      );
      if (reqId !== requestIdRef.current) return;
      const merged = results.flat().sort((x: any, y: any) => {
        const dx = new Date(x.scheduled_start_at as any).getTime();
        const dy = new Date(y.scheduled_start_at as any).getTime();
        return dy - dx;
      });
      setVisits(merged);
    } catch (err: any) {
      if (reqId !== requestIdRef.current) return;
      setError(err?.message || "Failed to load visit schedules");
      setVisits([]);
    } finally {
      if (reqId === requestIdRef.current) setLoading(false);
    }
  }, [companyId, employeeId]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const memoCols = useMemo(() => columns, []);

  if (loading) return <Shell>Loading visit schedules...</Shell>;
  if (error)
    return (
      <div className="rounded-lg border border-red-200 bg-white p-8 text-center text-sm text-red-600">
        {error}
      </div>
    );
  if (!visits.length)
    return (
      <Shell>
        <CalendarRange className="mx-auto mb-3 h-8 w-8 text-gray-300" />
        No visit schedules found for this employee
      </Shell>
    );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
      <DegoTable
        columns={memoCols}
        data={visits as any}
        searchKey="title"
        placeholder="Search visits..."
      />
    </div>
  );
}
