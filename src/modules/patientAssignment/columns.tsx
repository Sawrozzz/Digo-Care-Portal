/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import type { PatientAssignment } from "../../utils";

import { AssignmentActionsCell } from "./AssignmentActionsCell";
import {
  FALLBACK_BADGE_STYLE,
  METHOD_STYLES,
  PRIORITY_STYLES,
  STATUS_STYLES,
  formatAssignmentDateTime,
} from "./patientAssignmentAttributes";

interface PatientAssignmentColumnsProps {
  companyId: number;
  onEdit: (assignment: PatientAssignment) => void;
  reloadTable: () => Promise<void>;
}

export const patientAssignmentColumns = ({
  companyId,
  onEdit,
  reloadTable,
}: PatientAssignmentColumnsProps): ColumnDef<PatientAssignment>[] => {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <p>{`PA-#${row.original.id}`}</p>,
    },
    {
      accessorKey: "patient_name",
      header: "Patient",
      cell: ({ row }) => {
        const name = (row.original as any).patient_name;
        const patientId = (row.original as any).patient?.patient_id;

        return (
          <div className="flex flex-col">
            <p className="font-medium text-gray-900">{name || "—"}</p>
            {patientId && <p className="text-xs text-gray-500">{patientId}</p>}
          </div>
        );
      },
    },
    {
      accessorKey: "employee_name",
      header: "Employee",
      cell: ({ row }) => {
        const name = (row.original as any).employee_name;
        return <p className="text-gray-700">{name || "—"}</p>;
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
              PRIORITY_STYLES[priority] || FALLBACK_BADGE_STYLE
            }`}
          >
            {priority || "—"}
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
              STATUS_STYLES[status] || FALLBACK_BADGE_STYLE
            }`}
          >
            {status || "—"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "assignment_method",
      header: "Method",
      cell: ({ row }) => {
        const method = (row.original.assignment_method || "").toLowerCase();

        return (
          <Badge
            variant="outline"
            className={`capitalize px-3 py-2 ${
              METHOD_STYLES[method] || FALLBACK_BADGE_STYLE
            }`}
          >
            {method || "—"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => <p>{row.original.department || "—"}</p>,
    },
    {
      accessorKey: "room_number",
      header: "Room Number",
      cell: ({ row }) => <p>{row.original.room_number || "—"}</p>,
    },
    {
      accessorKey: "started_at",
      header: "Started At",
      cell: ({ row }) => (
        <p>{formatAssignmentDateTime(row.original.started_at)}</p>
      ),
    },
    {
      accessorKey: "ended_at",
      header: "Ended At",
      cell: ({ row }) => (
        <p>{formatAssignmentDateTime(row.original.ended_at)}</p>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <AssignmentActionsCell
          row={row}
          companyId={companyId}
          onEdit={onEdit}
          reloadTable={reloadTable}
        />
      ),
    },
  ];
};
