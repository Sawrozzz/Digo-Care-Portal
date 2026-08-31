/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Stethoscope } from "lucide-react";

import { GenericForm } from "../../components/custom";
import {
  createPatientAssignment,
  updatePatientAssignment,
} from "./patientAssignmentApi";
import { patientAssignmentFormFields } from "./patientAssignmentAttributes";
import { getAllPatientsOfACompany } from "../patient/patientApi";
import { parsePatientResponse } from "../../utils/appUtils";
import type { PatientAssignment } from "../../utils";

interface PatientAssignmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  employeeId: number;
  /** pass an assignment to edit it, omit it to create a new one */
  assignment?: PatientAssignment | null;
  reloadTable: () => Promise<void>;
}

/** `<input type="datetime-local">` only accepts "YYYY-MM-DDTHH:mm" */
const toDateTimeLocal = (value: Date | string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

const flattenAssignmentData = (assignment: PatientAssignment | null): any => {
  if (!assignment) return {};

  return {
    patient_id: assignment.patient?.id ? String(assignment.patient.id) : "",
    status: assignment.status ?? "",
    priority: assignment.priority ?? "",
    assignment_method: assignment.assignment_method ?? "",
    started_at: toDateTimeLocal(assignment.started_at),
    ended_at: toDateTimeLocal(assignment.ended_at),
    discharge_date: toDateTimeLocal(assignment.discharge_date),
    discharge_reason: assignment.discharge_reason ?? "",
    department: assignment.department ?? "",
    room_number: assignment.room_number ?? "",
    reason: assignment.reason ?? "",
    notes: assignment.notes ?? "",
  };
};

/**
 * The API returns validation failures as `{ field: ["message", ...] }` and the
 * request helper throws that body, so turn it into something readable.
 */
const toErrorMessage = (error: any, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error.error) return error.error;
  if (error.message) return error.message;

  if (typeof error === "object") {
    const parts = Object.entries(error)
      .map(([field, messages]) => {
        const text = Array.isArray(messages) ? messages.join(", ") : messages;
        return `${field.replace(/_/g, " ")} ${text}`;
      })
      .filter(Boolean);
    if (parts.length) return parts.join(" | ");
  }

  return fallback;
};

export function PatientAssignmentForm({
  open,
  onOpenChange,
  companyId,
  employeeId,
  assignment,
  reloadTable,
}: PatientAssignmentFormProps) {
  const [patientOptions, setPatientOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (open && companyId) {
      getAllPatientsOfACompany(Number(companyId))
        .then((response) => {
          const patients = parsePatientResponse(response);
          setPatientOptions(
            patients.map((p) => ({
              label: `${p.first_name} ${p.last_name}`.trim(),
              value: String(p.id),
            }))
          );
        })
        .catch(() => setPatientOptions([]));
    }
  }, [open, companyId]);

  const fields = useMemo(
    () => patientAssignmentFormFields(patientOptions),
    [patientOptions]
  );

  const initialData = useMemo(
    () => flattenAssignmentData(assignment ?? null),
    [assignment]
  );

  const handleSubmit = async (formData: Record<string, any>) => {
    // blank optional values must go over as null - Rails raises ArgumentError
    // when an enum column is assigned "" and cannot cast "" to a datetime
    const payload = {
      patient_id: Number(formData.patient_id),
      status: formData.status,
      priority: formData.priority,
      assignment_method: formData.assignment_method,
      started_at: formData.started_at,
      ended_at: formData.ended_at || null,
      discharge_date: formData.discharge_date || null,
      discharge_reason: formData.discharge_reason || null,
      department: formData.department || null,
      room_number: formData.room_number || null,
      reason: formData.reason || null,
      notes: formData.notes || null,
    };

    try {
      if (assignment?.id) {
        await updatePatientAssignment(
          Number(companyId),
          Number(employeeId),
          Number(assignment.id),
          payload
        );
      } else {
        await createPatientAssignment(
          Number(companyId),
          Number(employeeId),
          payload
        );
      }
    } catch (error: any) {
      throw new Error(
        toErrorMessage(
          error,
          assignment?.id
            ? "Failed to update patient assignment"
            : "Failed to create patient assignment"
        )
      );
    }
  };

  return (
    <GenericForm
      open={open}
      onOpenChange={onOpenChange}
      title="Patient Assignment"
      subtitle={
        assignment?.id
          ? "Update this patient assignment"
          : "Assign a patient to the selected employee"
      }
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      reloadTable={reloadTable}
      icon={<Stethoscope className="h-5 w-5 text-white cursor-pointer" />}
      isEditing={!!assignment?.id}
    />
  );
}
