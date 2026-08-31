/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFromApi, postToApi, updateToApi, deleteFromApi } from "../../utils";

export const getAllPatientAssignments = (
  companyId: number,
  employeeId: number
) => {
  return getFromApi(
    `/companies/${companyId}/employees/${employeeId}/patient_assignments`
  );
};

export const getPatientAssignment = (
  companyId: number,
  employeeId: number,
  assignmentId: number
) => {
  return getFromApi(
    `/companies/${companyId}/employees/${employeeId}/patient_assignments/${assignmentId}`
  );
};

export const createPatientAssignment = (
  companyId: number,
  employeeId: number,
  data: any
) => {
  return postToApi(
    `/companies/${companyId}/employees/${employeeId}/patient_assignments`,
    { patient_assignment: data }
  );
};

export const updatePatientAssignment = (
  companyId: number,
  employeeId: number,
  assignmentId: number,
  data: any
) => {
  return updateToApi(
    `/companies/${companyId}/employees/${employeeId}/patient_assignments/${assignmentId}`,
    { patient_assignment: data }
  );
};

export const deletePatientAssignment = (
  companyId: number,
  employeeId: number,
  assignmentId: number
) => {
  return deleteFromApi(
    `/companies/${companyId}/employees/${employeeId}/patient_assignments/${assignmentId}`
  );
};
