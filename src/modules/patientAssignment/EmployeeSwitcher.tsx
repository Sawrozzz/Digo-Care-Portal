import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useEmployeeStore } from "../../zustand/employeeStore";
import type { Employee } from "../../utils";

const employeeName = (employee: Employee) =>
  `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim() ||
  employee.name ||
  `Employee #${employee.id}`;

/**
 * Presentational only - the employee list is loaded by the page that owns the
 * company, so the switcher can be dropped anywhere (including a table toolbar)
 * without becoming responsible for fetching.
 */
export default function EmployeeSwitcher() {
  // atomic selectors so this only re-renders on the slices it actually reads
  const employees = useEmployeeStore((state) => state.employees);
  const activeEmployee = useEmployeeStore((state) => state.activeEmployee);
  const loading = useEmployeeStore((state) => state.loading);
  const setActiveEmployee = useEmployeeStore(
    (state) => state.setActiveEmployee
  );

  return (
    <div className="flex items-center gap-2">
      <Select
        value={activeEmployee ? String(activeEmployee.id) : ""}
        disabled={loading || employees.length === 0}
        onValueChange={(value) => {
          const employee = employees.find((e) => String(e.id) === value);
          if (employee) setActiveEmployee(employee);
        }}
      >
        <SelectTrigger className="h-10 w-56 rounded-lg border border-gray-200 bg-white text-sm">
          <SelectValue
            placeholder={
              loading
                ? "Loading employees..."
                : employees.length > 0
                  ? "Select an employee"
                  : "No employees available"
            }
          />
        </SelectTrigger>
        {/* popper = a plain dropdown anchored under the trigger. The default
            "item-aligned" mode sizes the list around the selected option and
            can end up showing a single row. */}
        <SelectContent position="popper" align="start" className="max-h-72">
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={String(employee.id)}>
              {employeeName(employee)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
