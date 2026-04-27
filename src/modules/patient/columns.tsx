/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import type { Patient } from "../../utils";

import { Pencil, Trash2Icon } from "lucide-react";
import { deletePatient } from "./patientApi";
import { DeleteConfirmationDialog } from "../../components/custom";
// import { CustomButton } from "../../components/custom/Button";
import { BASE_URL } from "../../utils";

import { useCompanyStore } from "../../zustand/companyStore";

interface PatientColumnsProps {
  onEdit: (patient: Patient) => void;
  reloadTable: () => Promise<void>;
  onRowClick?: (patient: Patient) => void;
}

export const patientColumns = ({
  onEdit,
  reloadTable,
  onRowClick,
}: PatientColumnsProps): ColumnDef<Patient>[] => {
  const DeleteActionCell = ({ row }: { row: any }) => {
    const { activeCompany } = useCompanyStore();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const firstName = row.original.first_name;
    const lastName = row.original.last_name;
    const name = `${firstName}, ${lastName}`;

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
          itemName={name}
          onConfirm={() =>
            deletePatient(Number(activeCompany?.id), row.original.id)
          }
          reloadTable={reloadTable}
        />
      </>
    );
  };

  const NameCell = ({ row }: { row: any }) => {
    const firstName = row.original.first_name;
    const lastName = row.original.last_name;
    // const middleName = row.original?.middle_name;

    const name = `${firstName}, ${lastName}`;
    const email = row.original.email;
    const avatar = row.original.avatar;
    const avatarUrl = row.original.avatar?.url;

    return (
      <>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
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

          <div
            onClick={() => onRowClick?.(row.original)}
            className="cursor-pointer hover:bg-gray-50 rounded p-2 transition"
          >
            <p className="font-medium text-blue-600 hover:text-blue-800">
              {name}
            </p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>
      </>
    );
  };

  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <p>{`P-#${row.original.id}`}</p>,
    },
    {
      accessorKey: "patient_id",
      header: "PATIENT ID",
      cell: ({ row }) => <p>{row.original.patient_id}</p>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: NameCell,
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => {
        const phone = row.original.phone;
        const phone2 = row.original.phone2;

        const phones = [phone, phone2].filter(Boolean);

        return (
          <div className="flex flex-col gap-1">
            {phones.map((p, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 ${
                  idx === 0
                    ? "font-semibold text-foreground"
                    : "text-sm text-muted-foreground"
                }`}
              >
                {idx === 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    Primary
                  </span>
                )}
                {idx === 1 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    Secondary
                  </span>
                )}
                <span>{p}</span>
              </div>
            ))}
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
          inactive: "bg-gray-100 text-gray-700 border-gray-200",
          pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
          archived: "bg-red-100 text-red-700 border-red-200",
        };

        return (
          <Badge
            variant="outline"
            className={`capitalize px-3 py-2 ${statusStyles[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
          >
            {status}
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
