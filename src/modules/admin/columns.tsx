import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import type { Admin } from "./adminAttributes";
import {
  IconCircleCheckFilled,
  IconCircleRectangleFilled,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

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
            <IconCircleRectangleFilled color="red"/>
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
        <button onClick={() => alert("Edit")}>
          <IconEdit size={20} color="green" className=" cursor-pointer" />
        </button>
        <button onClick={() => alert("Delete")}>
          <IconTrash size={20} color="red" className="cursor-pointer" />
        </button>
      </div>
    ),
  },
];
