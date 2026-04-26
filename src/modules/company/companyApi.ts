/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFromApi, postToApi, updateToApi, deleteFromApi } from "../../utils";
import type { Address } from "../../utils/utilTypes";
import {
  createCompanyAccountSchema,
  type CreateCompanyAccountInput,
} from "./companyAttributes";

interface CompanyCreateData {
  name: string;
  display_name?: string;
  email: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  status: string;
  address?: Address;
}

interface CompanyUpdateData {
  name?: string;
  display_name?: string;
  email?: string;
  phone?: string;
  phone2?: string;
  phone3?: string;
  status?: string;
  address?: Address;
}

const formatCompanyData = (
  data: any
): CompanyCreateData | CompanyUpdateData => {
  const formatted = { ...data };

  if (
    data["address.country"] ||
    data["address.district"] ||
    data["address.province"] ||
    data["address.municipality"] ||
    data["address.ward_no"]
  ) {
    formatted.address = {
      country: data["address.country"],
      district: data["address.district"],
      province: data["address.province"],
      municipality: data["address.municipality"],
      ward_no: parseInt(data["address.ward_no"]),
    };

    delete formatted["address.country"];
    delete formatted["address.district"];
    delete formatted["address.province"];
    delete formatted["address.municipality"];
    delete formatted["address.ward_no"];
  }

  return formatted;
};

export const getAllCompanies = () => {
  return getFromApi("/companies");
};

export const getSingleCompany = (id: number) => {
  return getFromApi(`/companies/${id}`);
};

export const createCompany = (data: any) => {
  const formattedData = formatCompanyData(data);
  return postToApi("/companies", { company: formattedData });
};

export const updateCompany = (id: number, data: any) => {
  const formattedData = formatCompanyData(data);
  return updateToApi(`/companies/${id}`, { company: formattedData });
};

export const deleteCompany = (id: number) => {
  return deleteFromApi(`/companies/${id}`);
};

// Create Company Admin Account
export const createCompanyAdminAccount = async (
  companyId: number,
  data: CreateCompanyAccountInput
) => {
  // Validate input with Zod schema
  const validatedData = createCompanyAccountSchema.parse(data);

  const response = await postToApi(
    `/admins/create_company_admin/${companyId}`,
    {
      account: {
        password: validatedData.password,
        password_confirmation: validatedData.password_confirmation,
      },
    }
  );

  return response;
};

export const removeCompanyAdminAccount = (
  adminId: number,
  companyId: number
) => {
  return deleteFromApi(`/admins/${adminId}/remove_company_admin/${companyId}`);
};
