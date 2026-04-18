import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import { type Company } from "../../utils";

import {
  IconCircleCheckFilled,
  IconCircleRectangleFilled,
} from "@tabler/icons-react";

import { Pencil, Trash2Icon } from "lucide-react";

import { BASE_URL } from "../../utils";
import { deleteCompany } from "./companyApi";

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
      const avatar = row.original.avatar;
      const avatarUrl = row.original.avatar?.url;

      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-white shadow-sm">
            {avatar?.url ? (
              <img
                src={
                  avatarUrl?.startsWith("http")
                    ? avatarUrl
                    : `${BASE_URL}${avatarUrl}`
                }
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-gray-600">
                {name?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
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
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button onClick={() => alert("Edit")} title="Edit">
          <Pencil
            size={16}
            className=" cursor-pointer text-(--color-primary)"
          />
        </button>
        <button
          onClick={async () => {
            if (window.confirm(`Delete company "${row.original.name}"?`)) {
              try {
                await deleteCompany(row.original.id);
                alert("Company deleted successfully");
                window.location.reload();
              } catch (error: any) {
                alert(`Error: ${error.message || "Failed to delete company"}`);
              }
            }
          }}
          title="Delete"
        >
          <Trash2Icon size={16} color="red" className="cursor-pointer" />
        </button>
      </div>
    ),
  },
];
