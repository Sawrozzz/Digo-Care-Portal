/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import type { Admin } from "./adminAttributes";

import { Pencil, Trash2Icon } from "lucide-react";
import { deleteAdmin } from "./adminApi";
import { DeleteConfirmationDialog } from "../../components/custom";
import { roleData } from "../../utils";

interface AdminColumnsProps {
  onEdit: (admin: Admin) => void;
  reloadTable: () => Promise<void>;
}

export const adminColumns = ({
  onEdit,
  reloadTable,
}: AdminColumnsProps): ColumnDef<Admin>[] => {
  const DeleteActionCell = ({ row }: { row: any }) => {
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
      <>
        <div className="flex gap-2">
          <button onClick={() => onEdit(row.original)} title="Edit">
            <Pencil size={16} color="green" className="cursor-pointer" />
          </button>
          <button onClick={() => setDeleteOpen(true)} title="Delete">
            <Trash2Icon size={16} color="red" className="cursor-pointer" />
          </button>
        </div>

        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          itemName={row.original.name}
          onConfirm={() => deleteAdmin(row.original.id)}
          reloadTable={reloadTable}
        />
      </>
    );
  };

  return [
    {
      accessorKey: "id",
      header: "ID",
      accessorFn: (row) => row.id,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.original.name;
        const email = row.original?.email;

        return (
          <div className="flex items-center gap-2">
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;

        return <Badge variant="outline">{roleData[role] ?? role}</Badge>;
      },
    },
    {
      accessorKey: "has_account",
      header: "Account",
      cell: ({ row }) => {
        const hasAccount = row.original.has_account;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                hasAccount ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <p className="text-xs text-gray-600">
              {hasAccount ? "Account exists" : "No account"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status?.toLowerCase();

        const statusStyles: any = {
          active: "bg-green-100 text-green-700 border-green-200",
          in_active: "bg-gray-100 text-gray-700 border-gray-200",
          pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
          archived: "bg-red-100 text-red-700 border-red-200",
        };

        const outputData: any = {
          active: "Active",
          in_active: "Inactive",
          archived: "Archived",
        };

        return (
          <Badge
            variant="outline"
            className={`capitalize px-3 py-2 ${statusStyles[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
          >
            {outputData[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: DeleteActionCell,
    },
  ];
};
