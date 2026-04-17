/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import type { Company } from "./utilTypes";

export const toFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (typeof value === "object" && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
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
      name: attr?.name || `${attr?.first_name || ''} ${attr?.last_name || ''}`.trim(),
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
