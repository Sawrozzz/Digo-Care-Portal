/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getFromApi,
  postToApi,
  updateToApi,
  deleteFromApi,
  passwordSchema,
} from "../../utils";
import type { Patient } from "../../utils";
import type { CreatePatientAccountInput } from "./patientAttributes";

const formatPatientData = (data: any): Patient => {
  const formatted = { ...data };

  if (
    data["address.country"] ||
    data["address.district"] ||
    data["address.province"] ||
    data["address.municipality"] ||
    data["address.ward_no"] ||
    data["address.google_map"]
  ) {
    formatted.address = {
      country: data["address.country"],
      district: data["address.district"],
      province: data["address.province"],
      municipality: data["address.municipality"],
      ward_no: data["address.ward_no"],
      google_map: data["address.google_map"],
    };

    delete formatted["address.country"];
    delete formatted["address.district"];
    delete formatted["address.province"];
    delete formatted["address.municipality"];
    delete formatted["address.ward_no"];
    delete formatted["address.google_map"];
  }

  return formatted;
};

export const getAllPatientsOfACompany = (companyId: number) => {
  return getFromApi(`/companies/${companyId}/patients`);
};

export const getAPatientsOfACompany = (companyId: number, id: number) => {
  return getFromApi(`/companies/${companyId}/patients/${id}`);
};

export const createPatient = (companyId: number, data: any) => {
  const formattedData = formatPatientData(data);
  return postToApi(`/companies/${companyId}/patients`, {
    patient: formattedData,
  });
};

export const updatePatient = (companyId: number, id: number, data: any) => {
  const formattedData = formatPatientData(data);
  return updateToApi(`/companies/${companyId}/patients/${id}`, {
    patient: {
      ...formattedData,
      ...(data.avatar && { avatar: data.avatar }),
    },
  });
};

export const deletePatient = (companyId: number, id: number) => {
  return deleteFromApi(`/companies/${companyId}/patients/${id}`);
};

/**
 * Sets the patient's X-ray collection to exactly `attachables`.
 *
 * `has_many_attached :x_rays` replaces on assign (Rails 7.1+), so this is the
 * one primitive both "add" and "remove" are built from: the caller passes the
 * signed ids of every X-ray that should survive, plus any new `File`s. Anything
 * left out is purged by the backend.
 */
export const replacePatientXRays = (
  companyId: number,
  id: number,
  attachables: (string | File)[]
) => {
  return updateToApi(`/companies/${companyId}/patients/${id}`, {
    patient: {
      // an empty collection still has to reach Rails, and an empty array
      // serialises to nothing — [""] is the documented way to clear one
      x_rays: attachables.length ? attachables : [""],
    },
  });
};

/** Appends `files`, keeping every X-ray already attached. */
export const addPatientXRays = (
  companyId: number,
  id: number,
  existingSignedIds: string[],
  files: File[]
) => {
  return replacePatientXRays(companyId, id, [...existingSignedIds, ...files]);
};

/** Purges a single X-ray by re-sending only the survivors. */
export const removePatientXRay = (
  companyId: number,
  id: number,
  remainingSignedIds: string[]
) => {
  return replacePatientXRays(companyId, id, remainingSignedIds);
};

export const createPatientAccount = async (
  companyId: number,
  patientId: number,
  data: CreatePatientAccountInput
) => {
  // Validate input with Zod schema
  const validatedData = passwordSchema.parse(data);

  const response = await postToApi(
    `/companies/${companyId}/patients/create_patient_account/${patientId}`,
    {
      account: {
        password: validatedData.password,
        password_confirmation: validatedData.password_confirmation,
      },
    }
  );

  return response;
};

export const removePatientAccount = (companyId: number, patientId: number) => {
  return deleteFromApi(
    `/companies/${companyId}/patients/${patientId}/remove_account/`
  );
};
