/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import type { VisitSchedule } from "../../utils";

import { VisitScheduleActionsCell } from "./VisitScheduleActionsCell";
import {
  FALLBACK_BADGE_STYLE,
  VISIT_MODE_STYLES,
  VISIT_PRIORITY_STYLES,
  VISIT_STATUS_STYLES,
  VISIT_TYPE_STYLES,
  formatDuration,
  formatVisitDateTime,
  formatVisitTime,
} from "./visitScheduleAttributes";

interface VisitScheduleColumnsProps {
  companyId: number;
  employeeId: number;
  assignmentId: number;
  onEdit: (visit: VisitSchedule) => void;
  reloadTable: () => Promise<void>;
}

/** enum values arrive snake_cased - "in_progress" reads better as "in progress" */
const humanize = (value?: string) =>
  (value || "").toLowerCase().replace(/_/g, " ");

export const visitScheduleColumns = ({
  companyId,
  employeeId,
  assignmentId,
  onEdit,
  reloadTable,
}: VisitScheduleColumnsProps): ColumnDef<VisitSchedule>[] => {
  return [
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
          <p className="font-medium text-gray-900">
            {row.original.title || "—"}
          </p>
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
        const name = (row.original as any).patient_name;
        const patientId = row.original.patient?.patient_id;

        return (
          <div className="flex flex-col">
            <p className="text-gray-900">{name || "—"}</p>
            {patientId && <p className="text-xs text-gray-500">{patientId}</p>}
          </div>
        );
      },
    },
    {
      accessorKey: "scheduled_start_at",
      header: "Scheduled",
      cell: ({ row }) => {
        const { scheduled_start_at, scheduled_end_at, day_of_week } =
          row.original;

        return (
          <div className="flex flex-col">
            <p className="text-gray-900">
              {formatVisitDateTime(scheduled_start_at)}
            </p>
            <p className="text-xs text-gray-500">
              {day_of_week ? `${day_of_week} · ` : ""}
              until {formatVisitTime(scheduled_end_at)}
            </p>
          </div>
        );
      },
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
        const type = (row.original.visit_type || "").toLowerCase();

        return (
          <Badge
            variant="outline"
            className={`capitalize px-3 py-2 ${
              VISIT_TYPE_STYLES[type] || FALLBACK_BADGE_STYLE
            }`}
          >
            {humanize(type) || "—"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "visit_mode",
      header: "Mode",
      cell: ({ row }) => {
        const mode = (row.original.visit_mode || "").toLowerCase();

        return (
          <Badge
            variant="outline"
            className={`capitalize px-3 py-2 ${
              VISIT_MODE_STYLES[mode] || FALLBACK_BADGE_STYLE
            }`}
          >
            {humanize(mode) || "—"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = (row.original.priority || "").toLowerCase();

        return (
          <Badge
            variant="outline"
            className={`capitalize px-3 py-2 ${
              VISIT_PRIORITY_STYLES[priority] || FALLBACK_BADGE_STYLE
            }`}
          >
            {humanize(priority) || "—"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.original.status || "").toLowerCase();

        return (
          <Badge
            variant="outline"
            className={`capitalize px-3 py-2 ${
              VISIT_STATUS_STYLES[status] || FALLBACK_BADGE_STYLE
            }`}
          >
            {humanize(status) || "—"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const { location, meeting_link } = row.original;

        // an online visit carries its link instead of a physical location
        if (meeting_link) {
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
        }

        return <p>{location || "—"}</p>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <VisitScheduleActionsCell
          row={row}
          companyId={companyId}
          employeeId={employeeId}
          assignmentId={assignmentId}
          onEdit={onEdit}
          reloadTable={reloadTable}
        />
      ),
    },
  ];
};
