import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import type { PatientAssignment } from "../../utils";

interface AssignmentSwitcherProps {
  assignments: PatientAssignment[];
  activeAssignmentId: number | null;
  onChange: (assignment: PatientAssignment) => void;
  loading: boolean;
}

const assignmentLabel = (assignment: PatientAssignment) => {
  const name = `${assignment.patient?.first_name ?? ""} ${
    assignment.patient?.last_name ?? ""
  }`.trim();

  const who = name || assignment.patient?.patient_id || `PA-#${assignment.id}`;
  return `${who} · ${(assignment.status || "").replace(/_/g, " ")}`;
};

/**
 * Presentational only - the assignment list is loaded by the page that owns the
 * company and the employee, so the switcher can be dropped anywhere (including
 * a table toolbar) without becoming responsible for fetching.
 */
export default function AssignmentSwitcher({
  assignments,
  activeAssignmentId,
  onChange,
  loading,
}: AssignmentSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={activeAssignmentId ? String(activeAssignmentId) : ""}
        disabled={loading || assignments.length === 0}
        onValueChange={(value) => {
          const assignment = assignments.find((a) => String(a.id) === value);
          if (assignment) onChange(assignment);
        }}
      >
        <SelectTrigger className="h-10 w-64 rounded-lg border border-gray-200 bg-white text-sm capitalize">
          <SelectValue
            placeholder={
              loading
                ? "Loading assignments..."
                : assignments.length > 0
                  ? "Select an assignment"
                  : "No assignments available"
            }
          />
        </SelectTrigger>
        {/* popper = a plain dropdown anchored under the trigger. The default
            "item-aligned" mode sizes the list around the selected option and
            can end up showing a single row. */}
        <SelectContent position="popper" align="start" className="max-h-72">
          {assignments.map((assignment) => (
            <SelectItem
              key={assignment.id}
              value={String(assignment.id)}
              className="capitalize"
            >
              {assignmentLabel(assignment)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
