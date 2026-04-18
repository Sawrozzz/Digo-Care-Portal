/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import type { Admin } from "./adminAttributes";
import {
  IconCircleCheckFilled,
  IconCircleRectangleFilled,
} from "@tabler/icons-react";

import { Pencil, Trash2Icon } from "lucide-react";
import { deleteAdmin } from "./adminApi";
import { DeleteConfirmationDialog } from "../../components/custom";
import { CustomButton } from "../../components/custom/Button";

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
      accessorFn: (row) => row.role,
    },
    {
      accessorKey: "has_account",
      header: "Account",
      cell: ({ row }) => {
        const hasAcc = row.original.has_account;

        return (
          <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                hasAcc ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <p className="text-xs text-gray-600">
              {hasAcc ? "Account exists" : "No account"}
            </p>
          </div>
            <div className="border-t w-42 border-gray-200" />
        
          {hasAcc ? (
            <CustomButton
              variantType="secondary"
              size="sm"
              onClick={() => alert(row.original.id)}
              className="w-fit text-sm cursor-pointer"
            >
              Remove Account
            </CustomButton>
          ) : (
            <CustomButton
              variantType="primary"
              size="sm"
              onClick={() => alert(row.original.id)}
              className="w-fit text-sm cursor-pointer"
            >
              Create Account
            </CustomButton>
          )}
        </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className=" uppercase">
          {row.original.status === "active" ? (
            <IconCircleCheckFilled color="green" />
          ) : (
            <IconCircleRectangleFilled color="red" />
          )}
          {row.original.status ?? "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: DeleteActionCell,
    },
  ];
};
