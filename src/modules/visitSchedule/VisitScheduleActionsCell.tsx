/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Ban,
  CalendarClock,
  CircleCheckBig,
  Pencil,
  Trash2Icon,
} from "lucide-react";

import { DeleteConfirmationDialog } from "../../components/custom";
import type { VisitSchedule } from "../../utils";

import { VisitActionDialog } from "./VisitActionDialog";
import {
  cancelVisit,
  deleteVisitSchedule,
  markVisitVisited,
  rescheduleVisit,
} from "./visitScheduleApi";
import {
  isOpenVisit,
  toDateTimeLocal,
  toErrorMessage,
} from "./visitScheduleAttributes";

interface VisitScheduleActionsCellProps {
  row: any;
  companyId: number;
  employeeId: number;
  assignmentId: number;
  onEdit: (visit: VisitSchedule) => void;
  reloadTable: () => Promise<void>;
}

/**
 * Lives in its own module on purpose: declaring it inside the column factory
 * creates a new component type on every render, which makes React unmount and
 * remount every action cell (and drop the dialogs' open state).
 */
export function VisitScheduleActionsCell({
  row,
  companyId,
  employeeId,
  assignmentId,
  onEdit,
  reloadTable,
}: VisitScheduleActionsCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [visitedOpen, setVisitedOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const visit = row.original as VisitSchedule;
  // visited / cancelled / rescheduled visits are closed - only edit and delete
  // still apply to them
  const open = isOpenVisit(visit.status);

  const ids = [
    Number(companyId),
    Number(employeeId),
    Number(assignmentId),
    Number(visit.id),
  ] as const;

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(visit)}
          title="Edit Visit"
          className="cursor-pointer"
        >
          <Pencil size={16} color="green" />
        </button>

        {open && (
          <>
            <button
              onClick={() => setVisitedOpen(true)}
              title="Mark as Visited"
              className="cursor-pointer"
            >
              <CircleCheckBig size={16} color="#16a34a" />
            </button>
            <button
              onClick={() => setRescheduleOpen(true)}
              title="Reschedule Visit"
              className="cursor-pointer"
            >
              <CalendarClock size={16} color="#ca8a04" />
            </button>
            <button
              onClick={() => setCancelOpen(true)}
              title="Cancel Visit"
              className="cursor-pointer"
            >
              <Ban size={16} color="#ea580c" />
            </button>
          </>
        )}

        <button
          onClick={() => setDeleteOpen(true)}
          title="Delete Visit"
          className="cursor-pointer"
        >
          <Trash2Icon size={16} color="red" />
        </button>
      </div>

      <VisitActionDialog
        open={visitedOpen}
        onOpenChange={setVisitedOpen}
        title="Mark as Visited"
        description={`Record "${visit.title}" as completed.`}
        icon={<CircleCheckBig className="h-6 w-6 text-green-600" />}
        iconWrapperClass="bg-green-100"
        confirmLabel="Mark Visited"
        confirmClass="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        successMessage="Visit marked as visited!"
        fields={[
          {
            name: "actual_start_at",
            label: "Actual Start",
            type: "datetime-local",
            defaultValue: toDateTimeLocal(visit.scheduled_start_at),
          },
          {
            name: "actual_end_at",
            label: "Actual End",
            type: "datetime-local",
            defaultValue: toDateTimeLocal(visit.scheduled_end_at),
          },
          {
            name: "visit_notes",
            label: "Visit Notes",
            type: "textarea",
            placeholder: "What happened during the visit?",
            defaultValue: visit.visit_notes ?? "",
          },
        ]}
        onConfirm={async (values) => {
          try {
            await markVisitVisited(...ids, {
              actual_start_at: values.actual_start_at || null,
              actual_end_at: values.actual_end_at || null,
              visit_notes: values.visit_notes || null,
            });
          } catch (error: any) {
            throw new Error(
              toErrorMessage(error, "Failed to mark the visit as visited")
            );
          }
        }}
        reloadTable={reloadTable}
      />

      <VisitActionDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        title="Reschedule Visit"
        description={`"${visit.title}" will be closed as rescheduled and a replacement visit created.`}
        icon={<CalendarClock className="h-6 w-6 text-yellow-600" />}
        iconWrapperClass="bg-yellow-100"
        confirmLabel="Reschedule"
        confirmClass="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
        successMessage="Visit rescheduled!"
        fields={[
          {
            name: "scheduled_start_at",
            label: "New Start",
            type: "datetime-local",
            required: true,
            defaultValue: toDateTimeLocal(visit.scheduled_start_at),
          },
          {
            name: "scheduled_end_at",
            label: "New End",
            type: "datetime-local",
            required: true,
            defaultValue: toDateTimeLocal(visit.scheduled_end_at),
          },
          {
            name: "reason",
            label: "Reason",
            type: "textarea",
            placeholder: "Why is this visit moving?",
          },
        ]}
        onConfirm={async (values) => {
          try {
            await rescheduleVisit(...ids, {
              scheduled_start_at: values.scheduled_start_at,
              scheduled_end_at: values.scheduled_end_at,
              reason: values.reason || null,
            });
          } catch (error: any) {
            throw new Error(
              toErrorMessage(error, "Failed to reschedule the visit")
            );
          }
        }}
        reloadTable={reloadTable}
      />

      <VisitActionDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel Visit"
        description={`"${visit.title}" will be marked as cancelled. The time slot is freed up.`}
        icon={<Ban className="h-6 w-6 text-orange-600" />}
        iconWrapperClass="bg-orange-100"
        confirmLabel="Cancel Visit"
        confirmClass="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        successMessage="Visit cancelled!"
        fields={[
          {
            name: "cancellation_reason",
            label: "Cancellation Reason",
            type: "textarea",
            placeholder: "Why is this visit being cancelled?",
          },
        ]}
        onConfirm={async (values) => {
          try {
            await cancelVisit(...ids, {
              cancellation_reason: values.cancellation_reason || null,
            });
          } catch (error: any) {
            throw new Error(
              toErrorMessage(error, "Failed to cancel the visit")
            );
          }
        }}
        reloadTable={reloadTable}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={visit.title || visit.visit_code || "Visit Schedule"}
        onConfirm={() => deleteVisitSchedule(...ids)}
        reloadTable={reloadTable}
      />
    </>
  );
}
