import type { FormField } from "../../components/custom";

/**
 * These MUST stay in sync with the enums on VisitSchedule (dego-care-api):
 *
 *   enum :status,     { pending: 0, confirmed: 1, in_progress: 2, visited: 3,
 *                       cancelled: 4, rescheduled: 5, no_show: 6 }, default: :pending
 *   enum :visit_type, { routine_checkup: 0, follow_up: 1, consultation: 2,
 *                       procedure: 3, therapy: 4, emergency: 5 }, prefix: true
 *   enum :visit_mode, { in_person: 0, online: 1, home_visit: 2 }, prefix: true
 *   enum :priority,   { routine: 0, urgent: 1, critical: 2 },     prefix: true
 *
 * Rails raises ArgumentError on any value outside these lists, so a wrong
 * option here is a failed request, not a validation message.
 */
export const VISIT_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In Progress", value: "in_progress" },
  { label: "Visited", value: "visited" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Rescheduled", value: "rescheduled" },
  { label: "No Show", value: "no_show" },
];

export const VISIT_TYPE_OPTIONS = [
  { label: "Routine Checkup", value: "routine_checkup" },
  { label: "Follow Up", value: "follow_up" },
  { label: "Consultation", value: "consultation" },
  { label: "Procedure", value: "procedure" },
  { label: "Therapy", value: "therapy" },
  { label: "Emergency", value: "emergency" },
];

export const VISIT_MODE_OPTIONS = [
  { label: "In Person", value: "in_person" },
  { label: "Online", value: "online" },
  { label: "Home Visit", value: "home_visit" },
];

export const VISIT_PRIORITY_OPTIONS = [
  { label: "Routine", value: "routine" },
  { label: "Urgent", value: "urgent" },
  { label: "Critical", value: "critical" },
];

const YES_NO_OPTIONS = [
  { label: "No", value: "false" },
  { label: "Yes", value: "true" },
];

/**
 * Statuses that still hold a slot on the calendar. Mirrors
 * VisitSchedule::OPEN_STATUSES - the api rejects overlapping visits only
 * between these, and the row actions (visit / reschedule / cancel) only make
 * sense while a visit is still open.
 */
export const OPEN_VISIT_STATUSES = ["pending", "confirmed", "in_progress"];

export const isOpenVisit = (status?: string) =>
  OPEN_VISIT_STATUSES.includes((status || "").toLowerCase());

// Badge palettes, keyed by the enum values above.
export const VISIT_STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 border-gray-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-indigo-100 text-indigo-700 border-indigo-200",
  visited: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  rescheduled: "bg-yellow-100 text-yellow-700 border-yellow-200",
  no_show: "bg-orange-100 text-orange-700 border-orange-200",
};

export const VISIT_TYPE_STYLES: Record<string, string> = {
  routine_checkup: "bg-gray-100 text-gray-700 border-gray-200",
  follow_up: "bg-sky-100 text-sky-700 border-sky-200",
  consultation: "bg-teal-100 text-teal-700 border-teal-200",
  procedure: "bg-purple-100 text-purple-700 border-purple-200",
  therapy: "bg-pink-100 text-pink-700 border-pink-200",
  emergency: "bg-red-100 text-red-700 border-red-200",
};

export const VISIT_MODE_STYLES: Record<string, string> = {
  in_person: "bg-purple-100 text-purple-700 border-purple-200",
  online: "bg-sky-100 text-sky-700 border-sky-200",
  home_visit: "bg-amber-100 text-amber-700 border-amber-200",
};

export const VISIT_PRIORITY_STYLES: Record<string, string> = {
  routine: "bg-gray-100 text-gray-700 border-gray-200",
  urgent: "bg-yellow-100 text-yellow-700 border-yellow-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

export const FALLBACK_BADGE_STYLE = "bg-gray-100 text-gray-600 border-gray-200";

export const formatVisitDateTime = (value: unknown) => {
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

export const formatVisitTime = (value: unknown) => {
  if (!value) return "—";
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDuration = (minutes?: number | null) => {
  if (minutes === null || minutes === undefined) return "—";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
};

/**
 * NOTE on gridCol: GenericForm only switches to its two-column layout when the
 * fields use more than one gridCol value (same trick patientAssignmentFormFields
 * uses).
 */
export const visitScheduleFormFields = (): FormField[] => [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "e.g. Weekly checkup",
    required: true,
    gridCol: 1,
  },
  {
    name: "visit_type",
    label: "Visit Type",
    type: "select",
    required: true,
    default: "routine_checkup",
    gridCol: 2,
    options: VISIT_TYPE_OPTIONS,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    default: "pending",
    gridCol: 2,
    options: VISIT_STATUS_OPTIONS,
  },
  {
    name: "visit_mode",
    label: "Visit Mode",
    type: "select",
    required: true,
    default: "in_person",
    gridCol: 2,
    options: VISIT_MODE_OPTIONS,
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    required: true,
    default: "routine",
    gridCol: 2,
    options: VISIT_PRIORITY_OPTIONS,
  },
  {
    name: "scheduled_start_at",
    label: "Scheduled Start",
    type: "datetime-local",
    required: true,
    gridCol: 2,
  },
  {
    name: "scheduled_end_at",
    label: "Scheduled End",
    type: "datetime-local",
    required: true,
    gridCol: 2,
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "Ward / room / address",
    required: false,
    gridCol: 2,
  },
  {
    name: "meeting_link",
    label: "Meeting Link",
    type: "text",
    placeholder: "Required for online visits",
    required: false,
    gridCol: 2,
  },
  {
    name: "reminder_at",
    label: "Reminder At",
    type: "datetime-local",
    required: false,
    gridCol: 2,
  },
  {
    name: "follow_up_required",
    label: "Follow Up Required",
    type: "select",
    required: true,
    default: "false",
    gridCol: 2,
    options: YES_NO_OPTIONS,
  },
  {
    name: "follow_up_date",
    label: "Follow Up Date",
    type: "date",
    required: false,
    gridCol: 2,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "What is this visit for?",
    required: false,
    gridCol: 2,
  },
  {
    name: "visit_notes",
    label: "Visit Notes",
    type: "textarea",
    placeholder: "Notes recorded during / after the visit",
    required: false,
    gridCol: 2,
  },
];

/** `<input type="datetime-local">` only accepts "YYYY-MM-DDTHH:mm" */
export const toDateTimeLocal = (value: Date | string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

/** `<input type="date">` only accepts "YYYY-MM-DD" */
export const toDateOnly = (value: Date | string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * The API returns validation failures as `{ field: ["message", ...] }` and the
 * request helper throws that body, so turn it into something readable. The
 * visit endpoints lean on this a lot - overlapping slots and out-of-range
 * windows both come back this way.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toErrorMessage = (error: any, fallback: string) => {
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
