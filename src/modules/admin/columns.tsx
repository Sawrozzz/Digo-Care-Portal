import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import type { Admin } from "./adminAttributes";
import {
  IconCircleCheckFilled,
  IconCircleRectangleFilled,
} from "@tabler/icons-react";

import { Pencil, Trash2Icon } from "lucide-react";

export const adminColumns: ColumnDef<Admin>[] = [
  {
    accessorKey: "id",
    header: "ID",
    accessorFn: (row) => row.id,
  },
  {
    accessorKey: "name",
    header: "Admin Name",
    accessorFn: (row) => row.name,
  },
  {
    accessorKey: "role",
    header: "Role",
    accessorFn: (row) => row.role,
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
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex gap-2">
        <button onClick={() => alert("Edit")} title="Edit">
          <Pencil size={16} color="green" className=" cursor-pointer" />
        </button>
        <button onClick={() => alert("Delete")} title="Delete">
          <Trash2Icon size={16} color="red" className="cursor-pointer" />
        </button>
      </div>
    ),
  },
];
