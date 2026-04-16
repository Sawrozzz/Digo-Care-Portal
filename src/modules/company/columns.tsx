import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import { type Company } from "../../utils";

import {
  IconCircleCheckFilled,
  IconCircleRectangleFilled,
} from "@tabler/icons-react";

import { Pencil, Trash2Icon } from "lucide-react";

export const companyColumns: ColumnDef<Company>[] = [
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
      const email = row.original.email;

      return (
        <div className="flex flex-col text-sm leading-tight">
          <span className="font-medium">{name}</span>
          <span className="text-muted-foreground">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => {
      const phone = row.original.phone;
      const phone2 = row.original.phone2;
      const phone3 = row.original.phone3;

      return (
        <div className="flex flex-col text-sm leading-tight">
          <span className="font-medium">{phone}</span>
          <span className="text-muted-foreground">
            {phone2}, {phone3}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address;

      if (!address) return <span className="text-muted-foreground">N/A</span>;

      return (
        <div className="flex flex-col text-sm leading-tight">
          <span className="font-medium">
            {address.municipality}, Ward {address.ward_no}
          </span>
          <span className="text-muted-foreground">
            {address.province}, {address.country}
          </span>
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
