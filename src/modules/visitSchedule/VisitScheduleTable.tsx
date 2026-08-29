/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DegoTable } from "../../components/custom/DegoTable";
import { parseVisitScheduleResponse } from "../../utils/appUtils";
import type { VisitSchedule } from "../../utils";

import { visitScheduleColumns } from "./columns";
import { getAllVisitSchedules } from "./visitScheduleApi";
import { VisitScheduleForm } from "./VisitScheduleForm";

interface VisitScheduleTableProps {
  companyId: number;
  employeeId: number;
  assignmentId: number;
  /**
   * Visits can only be created under an active assignment (see
   * VisitSchedule#assignment_is_active), so the Add button is hidden otherwise
   * rather than letting the request fail.
   */
  canAdd: boolean;
  /** extra controls rendered in the table's top bar, next to the search box */
  toolbar?: React.ReactNode;
}

export default function VisitScheduleTable({
  companyId,
  employeeId,
  assignmentId,
  canAdd,
  toolbar,
}: VisitScheduleTableProps) {
  const [visitData, setVisitData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VisitSchedule | null>(
    null
  );

  // only the newest request is allowed to write state - stops a slow response
  // for a previous assignment (or StrictMode's duplicate effect) from landing
  const requestIdRef = useRef(0);

  const fetchVisits = useCallback(async () => {
    if (!companyId || !employeeId || !assignmentId) return;

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getAllVisitSchedules(
        Number(companyId),
        Number(employeeId),
        Number(assignmentId)
      );
      if (requestId !== requestIdRef.current) return;
      setVisitData(parseVisitScheduleResponse(response));
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      setError(err.message || "Failed to fetch visit schedules");
      setVisitData([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [companyId, employeeId, assignmentId]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const handleAddClick = useCallback(() => {
    setSelectedVisit(null);
    setFormOpen(true);
  }, []);

  const handleEditClick = useCallback((visit: VisitSchedule) => {
    setSelectedVisit(visit);
    setFormOpen(true);
  }, []);

  // stable identity, otherwise TanStack rebuilds the whole table every render
  const columns = useMemo(
    () =>
      visitScheduleColumns({
        companyId: Number(companyId),
        employeeId: Number(employeeId),
        assignmentId: Number(assignmentId),
        onEdit: handleEditClick,
        reloadTable: fetchVisits,
      }),
    [companyId, employeeId, assignmentId, handleEditClick, fetchVisits]
  );

  // keep the toolbar mounted while visits load, otherwise the controls in it
  // (the employee and assignment switchers) disappear on every switch
  if (loading || error) {
    return (
      <div className="w-full space-y-4 pt-4">
        {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading visit schedules...
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
        data={visitData}
        searchKey="title"
        placeholder="Search visits..."
        onAddData={canAdd ? handleAddClick : undefined}
        toolbar={toolbar}
      />

      {!canAdd && (
        <p className="pt-2 text-xs text-muted-foreground">
          New visits can only be added to an active assignment.
        </p>
      )}

      <VisitScheduleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        companyId={Number(companyId)}
        employeeId={Number(employeeId)}
        assignmentId={Number(assignmentId)}
        visit={selectedVisit}
        reloadTable={fetchVisits}
      />
    </>
  );
}
