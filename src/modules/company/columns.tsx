/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

import type { Company } from "./companyAttributes";

import { Pencil, Trash2Icon } from "lucide-react";
import { deleteCompany, updateCompany } from "./companyApi";
import { DeleteConfirmationDialog } from "../../components/custom";
import { CustomButton } from "../../components/custom/Button";
import { BASE_URL } from "../../utils";
import { CreateCompanyAccountDialog } from "./CreateCompanyAccountDialog";
import { AvatarUploadDialog } from "../../components/custom/AvatarUploadDialogue";
import { RemoveCompanyAccountDialog } from "./RemoveCompanyAccountDialog";

interface CompanyColumnsProps {
  onEdit: (company: Company) => void;
  reloadTable: () => Promise<void>;
  onRowClick?: (company: Company) => void;
}

export const companyColumns = ({
  onEdit,
  reloadTable,
  onRowClick,
}: CompanyColumnsProps): ColumnDef<Company>[] => {
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
          onConfirm={() => deleteCompany(row.original.id)}
          reloadTable={reloadTable}
        />
      </>
    );
  };

  const NameCell = ({ row }: { row: any }) => {
    const name = row.original.name;
    const email = row.original.email;
    const avatar = row.original.avatar;
    const avatarUrl = row.original.avatar?.url;
    const [avatarUploadOpen, setAvatarUploadOpen] = useState(false);

    return (
      <>
        <div className="flex items-center gap-3">
          <div
            onClick={() => setAvatarUploadOpen(true)}
            className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
          >
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
        <AvatarUploadDialog
          open={avatarUploadOpen}
          onOpenChange={setAvatarUploadOpen}
          title="Upload Company Avatar"
          fieldName="avatar"
          onUpload={async (formData) => {
            const file = formData.get("avatar") as File;
            await updateCompany(row.original.id, {
              avatar: file,
            });
          }}
          onSuccess={reloadTable}
        />
      </>
    );
  };

  const AccountCell = ({ row }: { row: any }) => {
    const hasAcc = row.original.has_account;

    const [openCreate, setOpenCreate] = useState(false);
    const [openRemove, setOpenRemove] = useState(false); // ✅ add this

    return (
      <>
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

          {!hasAcc ? (
            <CustomButton
              variantType="primary"
              size="sm"
              className="w-fit text-sm cursor-pointer"
              onClick={() => setOpenCreate(true)}
            >
              Create Account
            </CustomButton>
          ) : (
            <CustomButton
              variantType="secondary"
              size="sm"
              className="w-fit text-sm cursor-pointer"
              onClick={() => setOpenRemove(true)}
            >
              Remove Account
            </CustomButton>
          )}
        </div>

        {/* Create Dialog */}
        <CreateCompanyAccountDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          companyId={row.original.id}
          onSuccess={reloadTable}
        />

        {/* Remove Dialog */}
        <RemoveCompanyAccountDialog
          open={openRemove}
          onOpenChange={setOpenRemove}
          companyId={row.original.id}
          onSuccess={reloadTable}
        />
      </>
    );
  };

  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <p>{`C-#${row.original.id}`}</p>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: NameCell,
    },
    {
      accessorKey: "display_name",
      header: "Display Name",
      cell: ({ row }) => (
        <p className="font-bold">{row.original?.display_name || "N/A"}</p>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => {
        const phone = row.original.phone;
        const phone2 = row.original.phone2;
        const phone3 = row.original.phone3;

        const phones = [phone, phone2, phone3].filter(Boolean);

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
                {idx === 2 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    Tertiary
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
      accessorKey: "has_account",
      header: "Account",
      cell: AccountCell,
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
