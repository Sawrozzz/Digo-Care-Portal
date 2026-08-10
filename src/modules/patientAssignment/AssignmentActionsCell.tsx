/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Pencil, Trash2Icon } from "lucide-react";

import { DeleteConfirmationDialog } from "../../components/custom";
import { useEmployeeStore } from "../../zustand/employeeStore";
import { deletePatientAssignment } from "./patientAssignmentApi";
import type { PatientAssignment } from "../../utils";

interface AssignmentActionsCellProps {
  row: any;
  companyId: number;
  onEdit: (assignment: PatientAssignment) => void;
  reloadTable: () => Promise<void>;
}

/**
 * Lives in its own module on purpose: declaring it inside the column factory
 * creates a new component type on every render, which makes React unmount and
 * remount every action cell (and drop the dialog's open state).
 */
export function AssignmentActionsCell({
  row,
  companyId,
  onEdit,
  reloadTable,
}: AssignmentActionsCellProps) {
  const activeEmployeeId = useEmployeeStore(
    (state) => state.activeEmployee?.id
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  const patientName = `${row.original.patient?.first_name ?? ""} ${
    row.original.patient?.last_name ?? ""
  }`.trim();

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(row.original)}
          title="Edit Assignment"
          className="cursor-pointer"
        >
          <Pencil size={16} color="green" />
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          title="Delete Assignment"
          className="cursor-pointer"
        >
          <Trash2Icon size={16} color="red" />
        </button>
      </div>

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={patientName || "Patient Assignment"}
        onConfirm={() =>
          deletePatientAssignment(
            Number(companyId),
            Number(activeEmployeeId),
            row.original.id
          )
        }
        reloadTable={reloadTable}
      />
    </>
  );
}
