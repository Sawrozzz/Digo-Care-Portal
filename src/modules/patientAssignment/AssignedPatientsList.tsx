/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";

import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { getAllPatientAssignments } from "./patientAssignmentApi";
import {
  FALLBACK_BADGE_STYLE,
  PRIORITY_STYLES,
  STATUS_STYLES,
  formatAssignmentDateTime,
} from "./patientAssignmentAttributes";
import { parsePatientAssignmentResponse } from "../../utils/appUtils";
import type { PatientAssignment } from "../../utils";

interface AssignedPatientsListProps {
  companyId: number;
  employeeId: number;
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
    {children}
  </div>
);

/**
 * Read-only view of the patients assigned to one employee, shown on the
 * employee profile. Assignments are created and edited from the Patient
 * Assignment page - there is deliberately no add / edit / delete here.
 */
export default function AssignedPatientsList({
  companyId,
  employeeId,
}: AssignedPatientsListProps) {
  const [assignments, setAssignments] = useState<PatientAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // only the newest request may write state
  const requestIdRef = useRef(0);

  const fetchAssignments = useCallback(async () => {
    if (!companyId || !employeeId) return;

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getAllPatientAssignments(
        Number(companyId),
        Number(employeeId)
      );
      if (requestId !== requestIdRef.current) return;
      setAssignments(parsePatientAssignmentResponse(response));
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      setError(err?.message || "Failed to load assigned patients");
      setAssignments([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [companyId, employeeId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  if (loading) return <Shell>Loading assigned patients...</Shell>;

  if (error)
    return (
      <div className="rounded-lg border border-red-200 bg-white p-8 text-center text-sm text-red-600">
        {error}
      </div>
    );

  if (!assignments.length)
    return (
      <Shell>
        <Users className="mx-auto mb-3 h-8 w-8 text-gray-300" />
        No patients assigned to this employee yet
      </Shell>
    );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
        <Users size={18} className="text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-900">
          Assigned Patients
        </h2>
        <span className="text-xs text-gray-400">({assignments.length})</span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 bg-gray-50/60">
            <TableRow>
              {[
                "Patient",
                "Contact",
                "Status",
                "Priority",
                "Started",
                "Reason",
              ].map((heading) => (
                <TableHead
                  key={heading}
                  className="px-6 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase"
                >
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {assignments.map((assignment) => {
              const patient: any = assignment.patient ?? {};
              const name = `${patient.first_name ?? ""} ${
                patient.last_name ?? ""
              }`.trim();
              const status = (assignment.status || "").toLowerCase();
              const priority = (assignment.priority || "").toLowerCase();

              return (
                <TableRow
                  key={assignment.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <TableCell className="px-6 py-4">
                    <p className="font-medium text-gray-900">{name || "—"}</p>
                    {patient.patient_id && (
                      <p className="text-xs text-gray-400">
                        {patient.patient_id}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-sm text-gray-600">
                    <p>{patient.phone || "—"}</p>
                    {patient.email && (
                      <p className="text-xs text-gray-400">{patient.email}</p>
                    )}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        STATUS_STYLES[status] || FALLBACK_BADGE_STYLE
                      }`}
                    >
                      {status || "—"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        PRIORITY_STYLES[priority] || FALLBACK_BADGE_STYLE
                      }`}
                    >
                      {priority || "—"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                    {formatAssignmentDateTime(assignment.started_at)}
                  </TableCell>

                  <TableCell className="max-w-xs px-6 py-4 text-sm text-gray-600">
                    <p className="truncate" title={assignment.reason || ""}>
                      {assignment.reason || "—"}
                    </p>
                    {(assignment.department || assignment.room_number) && (
                      <p className="text-xs text-gray-400">
                        {[assignment.department, assignment.room_number]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
