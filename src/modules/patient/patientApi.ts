/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFromApi, postToApi, updateToApi, deleteFromApi } from "../../utils";
import type { Patient } from "../../utils";

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
