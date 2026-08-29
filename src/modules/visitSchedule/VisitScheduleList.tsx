/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

import { Loader } from "../../components/custom";
import { SiteHeader } from "../../components/ui/site-header";
import { useCompanyStore } from "../../zustand/companyStore";
import { useEmployeeStore } from "../../zustand/employeeStore";
import { getAllPatientAssignments } from "../patientAssignment/patientAssignmentApi";
import EmployeeSwitcher from "../patientAssignment/EmployeeSwitcher";
import { parsePatientAssignmentResponse } from "../../utils/appUtils";
import type { PatientAssignment } from "../../utils";

import AssignmentSwitcher from "./AssignmentSwitcher";
import VisitScheduleTable from "./VisitScheduleTable";

export default function VisitSchedulePage() {
  const activeCompany = useCompanyStore((state) => state.activeCompany);
  const companiesLoading = useCompanyStore((state) => state.loading);
  const activeEmployeeId = useEmployeeStore(
    (state) => state.activeEmployee?.id
  );
  const employeesLoading = useEmployeeStore((state) => state.loading);
  const employeesError = useEmployeeStore((state) => state.error);
  const initializeEmployees = useEmployeeStore(
    (state) => state.initializeEmployees
  );

  const companyId = activeCompany?.id;

  // visits hang off an assignment, so this page has one more level to resolve
  // than the assignment page: company -> employee -> assignment -> visits
  const [assignments, setAssignments] = useState<PatientAssignment[]>([]);
  const [activeAssignment, setActiveAssignment] =
    useState<PatientAssignment | null>(null);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null);

  // same guard the tables use - a slow response for a previously selected
  // employee must not overwrite the list for the current one
  const requestIdRef = useRef(0);

  // the page owns the company, so it owns loading that company's employees -
  // the switcher just renders whatever is in the store
  useEffect(() => {
    if (companyId) {
      initializeEmployees(Number(companyId));
    }
  }, [companyId, initializeEmployees]);

  const fetchAssignments = useCallback(async () => {
    if (!companyId || !activeEmployeeId) return;

    const requestId = ++requestIdRef.current;
    setAssignmentsLoading(true);
    setAssignmentsError(null);

    try {
      const response = await getAllPatientAssignments(
        Number(companyId),
        Number(activeEmployeeId)
      );
      if (requestId !== requestIdRef.current) return;

      const list = parsePatientAssignmentResponse(response);
      setAssignments(list);
      // prefer an active assignment - it is the only kind that accepts new
      // visits, so defaulting to one saves a click in the common case
      setActiveAssignment(
        list.find((a) => a.status === "active") || list[0] || null
      );
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      setAssignmentsError(err.message || "Failed to fetch patient assignments");
      setAssignments([]);
      setActiveAssignment(null);
    } finally {
      if (requestId === requestIdRef.current) setAssignmentsLoading(false);
    }
  }, [companyId, activeEmployeeId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  if (companiesLoading) {
    return <Loader size={72} />;
  }

  if (!companyId) {
    return (
      <>
        <SiteHeader name="Visit Schedules" />
        <p className="p-6 text-sm text-muted-foreground">No company selected</p>
      </>
    );
  }

  const error = employeesError || assignmentsError;

  const switchers = (
    <>
      <EmployeeSwitcher />
      <AssignmentSwitcher
        assignments={assignments}
        activeAssignmentId={activeAssignment?.id ?? null}
        onChange={setActiveAssignment}
        loading={assignmentsLoading}
      />
    </>
  );

  return (
    <>
      <SiteHeader name="Visit Schedules" />

      <div className="p-4 lg:p-6">
        {error ? (
          <p className="rounded-lg border border-red-200 bg-white p-8 text-center text-sm text-red-600">
            {error}
          </p>
        ) : !activeEmployeeId ? (
          employeesLoading ? (
            <Loader size={72} />
          ) : (
            <p className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-muted-foreground">
              No employees available for this company
            </p>
          )
        ) : activeAssignment ? (
          // both switchers ride along in the table's top bar, lined up with the
          // search box and the Add New button
          <VisitScheduleTable
            companyId={Number(companyId)}
            employeeId={Number(activeEmployeeId)}
            assignmentId={Number(activeAssignment.id)}
            canAdd={activeAssignment.status === "active"}
            toolbar={switchers}
          />
        ) : assignmentsLoading ? (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">{switchers}</div>
            <Loader size={72} />
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">{switchers}</div>
            <p className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-muted-foreground">
              This employee has no patient assignments yet. Create one from the
              Patient Assignment page before scheduling visits.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
