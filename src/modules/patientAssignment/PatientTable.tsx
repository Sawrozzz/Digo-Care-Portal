/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DegoTable } from "../../components/custom/DegoTable";
import { patientAssignmentColumns } from "./columns";
import { getAllPatientAssignments } from "./patientAssignmentApi";
import { parsePatientAssignmentResponse } from "../../utils/appUtils";
import { PatientAssignmentForm } from "./PatientAssignmentForm";
import type { PatientAssignment } from "../../utils";

interface PatientTableProps {
  companyId: number;
  employeeId: number;
  /** extra controls rendered in the table's top bar, next to the search box */
  toolbar?: React.ReactNode;
}

export default function PatientTable({
  companyId,
  employeeId,
  toolbar,
}: PatientTableProps) {
  const [assignmentData, setAssignmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<PatientAssignment | null>(null);

  // only the newest request is allowed to write state - stops a slow response
  // for a previous employee (or StrictMode's duplicate effect) from landing
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
      setAssignmentData(parsePatientAssignmentResponse(response));
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      setError(err.message || "Failed to fetch patient assignments");
      setAssignmentData([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [companyId, employeeId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleAddClick = useCallback(() => {
    setSelectedAssignment(null);
    setFormOpen(true);
  }, []);

  const handleEditClick = useCallback((assignment: PatientAssignment) => {
    setSelectedAssignment(assignment);
    setFormOpen(true);
  }, []);

  // stable identity, otherwise TanStack rebuilds the whole table every render
  const columns = useMemo(
    () =>
      patientAssignmentColumns({
        companyId: Number(companyId),
        onEdit: handleEditClick,
        reloadTable: fetchAssignments,
      }),
    [companyId, handleEditClick, fetchAssignments]
  );

  // keep the toolbar mounted while assignments load, otherwise the controls in
  // it (the employee switcher) disappear on every switch
  if (loading || error) {
    return (
      <div className="w-full space-y-4 pt-4">
        {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading patient assignments...
          </div>
        ) : (
          <div className="rounded-lg border border-red-200 bg-white p-8 text-center text-sm text-red-600">
            Error: {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <DegoTable
        columns={columns}
        data={assignmentData}
        searchKey="patient_name"
        onAddData={handleAddClick}
        toolbar={toolbar}
      />
      <PatientAssignmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        companyId={Number(companyId)}
        employeeId={Number(employeeId)}
        assignment={selectedAssignment}
        reloadTable={fetchAssignments}
      />
    </>
  );
}
