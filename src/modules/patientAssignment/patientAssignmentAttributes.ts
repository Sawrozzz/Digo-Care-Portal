import type { FormField } from "../../components/custom";

/**
 * These MUST stay in sync with the enums on PatientAssignment (dego-care-api):
 *
 *   enum :status,            { active: 0, completed: 1, transferred: 2 }, default: :active
 *   enum :priority,          { routine: 0, urgent: 1, critical: 2 },      default: :routine
 *   enum :assignment_method, { physical: 0, online: 1 },                  default: :physical
 *   enum :discharge_reason,  { treatment_completed: 0, transferred_out: 1,
 *                              against_medical_advice: 2, other: 3 }, prefix: true
 *
 * Rails raises ArgumentError on any value outside these lists, so a wrong
 * option here is a failed request, not a validation message.
 */
export const ASSIGNMENT_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Transferred", value: "transferred" },
];

export const ASSIGNMENT_PRIORITY_OPTIONS = [
  { label: "Routine", value: "routine" },
  { label: "Urgent", value: "urgent" },
  { label: "Critical", value: "critical" },
];

export const ASSIGNMENT_METHOD_OPTIONS = [
  { label: "Physical", value: "physical" },
  { label: "Online", value: "online" },
];

export const DISCHARGE_REASON_OPTIONS = [
  { label: "Treatment Completed", value: "treatment_completed" },
  { label: "Transferred Out", value: "transferred_out" },
  { label: "Against Medical Advice", value: "against_medical_advice" },
  { label: "Other", value: "other" },
];

// Badge palettes, keyed by the enum values above. Shared by the assignment
// table and the read-only list on the employee profile.
export const PRIORITY_STYLES: Record<string, string> = {
  routine: "bg-gray-100 text-gray-700 border-gray-200",
  urgent: "bg-yellow-100 text-yellow-700 border-yellow-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

export const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
  transferred: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export const METHOD_STYLES: Record<string, string> = {
  physical: "bg-purple-100 text-purple-700 border-purple-200",
  online: "bg-sky-100 text-sky-700 border-sky-200",
};

export const FALLBACK_BADGE_STYLE = "bg-gray-100 text-gray-600 border-gray-200";

export const formatAssignmentDateTime = (value: unknown) => {
  if (!value) return "—";
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Built as a function because the patient list is loaded per company.
 *
 * NOTE on gridCol: GenericForm only switches to its two-column layout when the
 * fields use more than one gridCol value (same trick employeeFormFields uses).
 */
export const patientAssignmentFormFields = (
  patientOptions: { label: string; value: string }[]
): FormField[] => [
  {
    name: "patient_id",
    label: "Patient",
    type: "select",
    required: true,
    gridCol: 1,
    options: patientOptions,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    default: "active",
    gridCol: 2,
    options: ASSIGNMENT_STATUS_OPTIONS,
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    required: true,
    default: "routine",
    gridCol: 2,
    options: ASSIGNMENT_PRIORITY_OPTIONS,
  },
  {
    name: "assignment_method",
    label: "Assignment Method",
    type: "select",
    required: true,
    default: "physical",
    gridCol: 2,
    options: ASSIGNMENT_METHOD_OPTIONS,
  },
  {
    name: "started_at",
    label: "Started At",
    type: "datetime-local",
    required: true,
    gridCol: 2,
  },
  {
    name: "ended_at",
    label: "Ended At",
    type: "datetime-local",
    required: false,
    gridCol: 2,
  },
  {
    name: "department",
    label: "Department",
    type: "text",
    placeholder: "Enter department",
    required: false,
    gridCol: 2,
  },
  {
    name: "room_number",
    label: "Room Number",
    type: "text",
    placeholder: "Enter room number",
    required: false,
    gridCol: 2,
  },
  {
    name: "discharge_date",
    label: "Discharge Date",
    type: "datetime-local",
    required: false,
    gridCol: 2,
  },
  {
    name: "discharge_reason",
    label: "Discharge Reason",
    type: "select",
    required: false,
    // optional selects start empty (nullable column, no DB default) and can be
    // cleared again with the x button on the trigger
    placeholder: "Select Any",
    gridCol: 2,
    options: DISCHARGE_REASON_OPTIONS,
  },
  {
    name: "reason",
    label: "Reason",
    type: "textarea",
    placeholder: "Enter reason for assignment",
    required: false,
    gridCol: 2,
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Enter any notes",
    required: false,
    gridCol: 2,
  },
];
