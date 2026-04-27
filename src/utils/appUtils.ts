/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import type { Company, Patient } from "./utilTypes";

export const toFormData = (obj: any, form = new FormData(), parentKey = "") => {
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File || value instanceof Blob) {
      form.append(fullKey, value);
      return;
    }

    if (value && typeof value === "object" && !(value instanceof Date)) {
      return toFormData(value, form, fullKey);
    }

    if (value !== undefined && value !== null) {
      form.append(fullKey, value as any);
    }
  });

  return form;
};

export const decodeTokenFromHeader = (authHeader: Record<string, any>) => {
  if (authHeader) {
    const token = authHeader?.split(" ")[1];
    return token;
  } else return null;
};

export const toDateFormat = (dateStr: string) => {
  return dayjs(dateStr, "MM DD YYYY");
};

export const parseCompanyResponse = (response: any): Company[] => {
  const data = response.data;

  if (!data || !Array.isArray(data)) return [];

  return data.map((item: any) => {
    const attr = item.attributes;
    return {
      id: attr.id,
      name: attr.name,
      display_name: attr.display_name,
      status: attr.status,
      phone: attr.phone,
      phone2: attr.phone2,
      phone3: attr.phone3,
      email: attr.email,
      avatar: attr.avatar,
      address: attr.address,
      has_account: attr.has_account,
      created_at: toDateFormat(attr.created_at).toDate(),
      updated_at: toDateFormat(attr.updated_at).toDate(),
    };
  });
};

export const companyResponseForTable = (response: any): Company[] => {
  const data = response;

  if (!data || !Array.isArray(data)) return [];

  return data.map((item: any) => {
    const attr = item.attributes;

    return {
      id: attr?.id,
      name: attr?.name,
      display_name: attr?.display_name,
      status: attr?.status,
      phone: attr?.phone,
      phone2: attr?.phone2,
      phone3: attr?.phone3,
      email: attr?.email,
      avatar: attr?.avatar,
      address: attr?.address,
      created_at: attr?.created_at,
      updated_at: attr?.updated_at,
    };
  });
};

export const parseSingleCompanyData = (response: any): Company | null => {
  const data = response?.data;

  if (!data) return null;
  const attr = data.attributes;
  if (!attr) return null;

  return {
    id: attr.id,
    name: attr.name,
    display_name: attr.display_name,
    status: attr.status,
    phone: attr.phone,
    phone2: attr.phone2,
    phone3: attr.phone3,
    email: attr.email,
    avatar: attr.avatar,
    address: attr.address,
    created_at: toDateFormat(attr?.created_at).toDate(),
    updated_at: toDateFormat(attr.updated_at).toDate(),
  };
};

export const parseAdminResponse = (response: any): any[] => {
  const data = response.data;

  if (!data || !Array.isArray(data)) return [];

  return data.map((item: any) => {
    const attr = item.attributes;
    return {
      id: attr.id,
      name:
        attr.name || `${attr.first_name || ""} ${attr.last_name || ""}`.trim(),
      first_name: attr.first_name,
      last_name: attr.last_name,
      role: attr.role,
      status: attr.status,
      email: attr.email,
      created_at: toDateFormat(attr.created_at),
      updated_at: toDateFormat(attr.updated_at),
    };
  });
};

export const adminResponseForTable = (response: any): any[] => {
  const data = response;

  if (!data || !Array.isArray(data)) return [];

  return data.map((item: any) => {
    const attr = item.attributes;
    return {
      id: attr?.id,
      name:
        attr?.name ||
        `${attr?.first_name || ""} ${attr?.last_name || ""}`.trim(),
      first_name: attr?.first_name,
      last_name: attr?.last_name,
      role: attr?.role,
      status: attr?.status,
      email: attr?.email,
      has_account: attr?.has_account,
      created_at: toDateFormat(attr?.created_at),
      updated_at: toDateFormat(attr?.updated_at),
    };
  });
};

export const parseSingleAdminData = (response: any): any | null => {
  const data = response?.data;

  if (!data) return null;
  const attr = data.attributes;
  if (!attr) return null;

  return {
    id: attr.id,
    name:
      attr.name || `${attr.first_name || ""} ${attr.last_name || ""}`.trim(),
    first_name: attr.first_name,
    last_name: attr.last_name,
    role: attr.role,
    status: attr.status,
    email: attr.email,
    has_account: attr?.has_account,
    created_at: toDateFormat(attr.created_at),
    updated_at: toDateFormat(attr.updated_at),
  };
};

export const parseAdminResponseFixed = (response: any): any[] => {
  const data = response.data;

  if (!data || !Array.isArray(data)) return [];

  return data.map((item: any) => {
    const attr = item.attributes;
    return {
      id: attr.id,
      name:
        attr.name || `${attr.first_name || ""} ${attr.last_name || ""}`.trim(),
      first_name: attr.first_name,
      last_name: attr.last_name,
      role: attr.role,
      status: attr.status,
      email: attr.email,
      has_account: attr?.has_account,
      created_at: attr.created_at,
      updated_at: attr.updated_at,
    };
  });
};

export const parseSingleAdminDataFixed = (response: any): any | null => {
  const data = response?.data;

  if (!data) return null;
  const attr = data.attributes;
  if (!attr) return null;

  return {
    id: attr.id,
    name:
      attr.name || `${attr.first_name || ""} ${attr.last_name || ""}`.trim(),
    first_name: attr.first_name,
    last_name: attr.last_name,
    role: attr.role,
    status: attr.status,
    email: attr.email,
    has_account: attr?.has_account,
    created_at: attr.created_at,
    updated_at: attr.updated_at,
  };
};

export const parsePatientResponse = (response: any): Patient[] => {
  const data = response.data;

  if (!data || !Array.isArray(data)) return [];

  return data.map((item: any) => {
    const attr = item.attributes;

    return {
      id: attr.id,
      patient_id: attr.patient_id,
      first_name: attr.first_name,
      middle_name: attr.middle_name,
      last_name: attr.last_name,
      phone: attr.phone,
      phone2: attr.phone2,
      email: attr.email,
      gender: attr.gender,
      dob: attr.dob,
      blood_group: attr.blood_group,
      marital_status: attr.marital_status,
      status: attr.status,
      has_account: attr.has_account,
      avatar: attr.avatar,

      address: attr.address
        ? {
            id: attr.address.id,
            country: attr.address.country,
            province: attr.address.province,
            district: attr.address.district,
            municipality: attr.address.municipality,
            ward_no: attr.address.ward_no
              ? Number(attr.address.ward_no)
              : undefined,
            google_map: attr.address.google_map,
          }
        : undefined,

      created_at: attr.created_at
        ? toDateFormat(attr.created_at).toDate()
        : undefined,
      updated_at: attr.updated_at
        ? toDateFormat(attr.updated_at).toDate()
        : undefined,
    };
  });
};
