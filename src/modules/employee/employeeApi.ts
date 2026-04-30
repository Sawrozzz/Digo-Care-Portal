/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getFromApi,
  postToApi,
  updateToApi,
  deleteFromApi,
  passwordSchema,
} from "../../utils";
import type { Employee } from "../../utils";
import type { CreateEmployeeAccountInput } from "./employeeAttributes";

const formatEmployeeData = (data: any): Employee => {
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

export const getAllEmployeesOfACompany = (companyId: number) => {
  return getFromApi(`/companies/${companyId}/employees`);
};

export const getAEmployeeOfACompany = (companyId: number, id: number) => {
  return getFromApi(`/companies/${companyId}/employees/${id}`);
};

export const createEmployee = (companyId: number, data: any) => {
  const formattedData = formatEmployeeData(data);
  return postToApi(`/companies/${companyId}/employees`, {
    employee: formattedData,
  });
};

export const updateEmployee = (companyId: number, id: number, data: any) => {
  const formattedData = formatEmployeeData(data);
  return updateToApi(`/companies/${companyId}/employees/${id}`, {
    employee: {
      ...formattedData,
      ...(data.avatar && { avatar: data.avatar }),
    },
  });
};

export const deleteEmployee = (companyId: number, id: number) => {
  return deleteFromApi(`/companies/${companyId}/employees/${id}`);
};

export const createEmployeeAccount = async (
  companyId: number,
  employeeId: number,
  data: CreateEmployeeAccountInput
) => {
  // Validate input with Zod schema
  const validatedData = passwordSchema.parse(data);

  const response = await postToApi(
    `/companies/${companyId}/employees/create_employee_account/${employeeId}`,
    {
      account: {
        password: validatedData.password,
        password_confirmation: validatedData.password_confirmation,
      },
    }
  );

  return response;
};

export const removeEmployeeAccount = (
  companyId: number,
  employeeId: number
) => {
  return deleteFromApi(
    `/companies/${companyId}/employees/${employeeId}/remove_account`
  );
};
