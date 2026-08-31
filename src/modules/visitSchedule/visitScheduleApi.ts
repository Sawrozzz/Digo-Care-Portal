/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getFromApi,
  postToApi,
  updateToApi,
  patchToApi,
  deleteFromApi,
} from "../../utils";

/**
 * Visits are nested under the assignment they belong to, so every call needs
 * the full company -> employee -> assignment chain:
 *
 *   /companies/:company_id/employees/:employee_id
 *     /patient_assignments/:patient_assignment_id/visit_schedules
 */
const scheduleUrl = (
  companyId: number,
  employeeId: number,
  assignmentId: number
) =>
  `/companies/${companyId}/employees/${employeeId}` +
  `/patient_assignments/${assignmentId}/visit_schedules`;

export const getAllVisitSchedules = (
  companyId: number,
  employeeId: number,
  assignmentId: number,
  params?: any
) => {
  return getFromApi(scheduleUrl(companyId, employeeId, assignmentId), params);
};

export const getVisitSchedule = (
  companyId: number,
  employeeId: number,
  assignmentId: number,
  visitId: number
) => {
  return getFromApi(
    `${scheduleUrl(companyId, employeeId, assignmentId)}/${visitId}`
  );
};

export const createVisitSchedule = (
  companyId: number,
  employeeId: number,
  assignmentId: number,
  data: any
) => {
  return postToApi(scheduleUrl(companyId, employeeId, assignmentId), {
    visit_schedule: data,
  });
};

export const updateVisitSchedule = (
  companyId: number,
  employeeId: number,
  assignmentId: number,
  visitId: number,
  data: any
) => {
  return updateToApi(
    `${scheduleUrl(companyId, employeeId, assignmentId)}/${visitId}`,
    { visit_schedule: data }
  );
};

export const deleteVisitSchedule = (
  companyId: number,
  employeeId: number,
  assignmentId: number,
  visitId: number
) => {
  return deleteFromApi(
    `${scheduleUrl(companyId, employeeId, assignmentId)}/${visitId}`
  );
};

/**
 * The three member actions below are flat params (not wrapped in
 * `visit_schedule`) - see VisitSchedulesController#mark_visited / #cancel /
 * #reschedule, which read them straight off `params`.
 */
export const markVisitVisited = (
  companyId: number,
  employeeId: number,
  assignmentId: number,
  visitId: number,
  data: any
) => {
  return patchToApi(
    `${scheduleUrl(companyId, employeeId, assignmentId)}/${visitId}/mark_visited`,
    data
  );
};

export const cancelVisit = (
  companyId: number,
  employeeId: number,
  assignmentId: number,
  visitId: number,
  data: any
) => {
  return patchToApi(
    `${scheduleUrl(companyId, employeeId, assignmentId)}/${visitId}/cancel`,
    data
  );
};

/** Closes the visit as `rescheduled` and returns its replacement. */
export const rescheduleVisit = (
  companyId: number,
  employeeId: number,
  assignmentId: number,
  visitId: number,
  data: any
) => {
  return postToApi(
    `${scheduleUrl(companyId, employeeId, assignmentId)}/${visitId}/reschedule`,
    data
  );
};
