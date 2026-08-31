/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { CalendarClock } from "lucide-react";

import { GenericForm } from "../../components/custom";
import { createVisitSchedule, updateVisitSchedule } from "./visitScheduleApi";
import {
  visitScheduleFormFields,
  toDateTimeLocal,
  toDateOnly,
  toErrorMessage,
} from "./visitScheduleAttributes";
import type { VisitSchedule } from "../../utils";

interface VisitScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  employeeId: number;
  assignmentId: number;
  /** pass a visit to edit it, omit it to create a new one */
  visit?: VisitSchedule | null;
  reloadTable: () => Promise<void>;
}

const flattenVisitData = (visit: VisitSchedule | null): any => {
  if (!visit) return {};

  return {
    title: visit.title ?? "",
    visit_type: visit.visit_type ?? "",
    status: visit.status ?? "",
    visit_mode: visit.visit_mode ?? "",
    priority: visit.priority ?? "",
    scheduled_start_at: toDateTimeLocal(visit.scheduled_start_at),
    scheduled_end_at: toDateTimeLocal(visit.scheduled_end_at),
    location: visit.location ?? "",
    meeting_link: visit.meeting_link ?? "",
    reminder_at: toDateTimeLocal(visit.reminder_at),
    follow_up_required: visit.follow_up_required ? "true" : "false",
    follow_up_date: toDateOnly(visit.follow_up_date),
    description: visit.description ?? "",
    visit_notes: visit.visit_notes ?? "",
  };
};

export function VisitScheduleForm({
  open,
  onOpenChange,
  companyId,
  employeeId,
  assignmentId,
  visit,
  reloadTable,
}: VisitScheduleFormProps) {
  const fields = useMemo(() => visitScheduleFormFields(), []);

  const initialData = useMemo(() => flattenVisitData(visit ?? null), [visit]);

  const handleSubmit = async (formData: Record<string, any>) => {
    // blank optional values must go over as null - Rails raises ArgumentError
    // when an enum column is assigned "" and cannot cast "" to a datetime
    const payload = {
      title: formData.title,
      visit_type: formData.visit_type,
      status: formData.status,
      visit_mode: formData.visit_mode,
      priority: formData.priority,
      scheduled_start_at: formData.scheduled_start_at,
      scheduled_end_at: formData.scheduled_end_at,
      location: formData.location || null,
      meeting_link: formData.meeting_link || null,
      reminder_at: formData.reminder_at || null,
      follow_up_required: formData.follow_up_required === "true",
      follow_up_date: formData.follow_up_date || null,
      description: formData.description || null,
      visit_notes: formData.visit_notes || null,
    };

    try {
      if (visit?.id) {
        await updateVisitSchedule(
          Number(companyId),
          Number(employeeId),
          Number(assignmentId),
          Number(visit.id),
          payload
        );
      } else {
        await createVisitSchedule(
          Number(companyId),
          Number(employeeId),
          Number(assignmentId),
          payload
        );
      }
    } catch (error: any) {
      throw new Error(
        toErrorMessage(
          error,
          visit?.id
            ? "Failed to update visit schedule"
            : "Failed to create visit schedule"
        )
      );
    }
  };

  return (
    <GenericForm
      open={open}
      onOpenChange={onOpenChange}
      title="Visit Schedule"
      subtitle={
        visit?.id
          ? "Update this scheduled visit"
          : "Schedule a visit inside the selected patient assignment"
      }
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      reloadTable={reloadTable}
      icon={<CalendarClock className="h-5 w-5 text-white cursor-pointer" />}
      isEditing={!!visit?.id}
    />
  );
}
