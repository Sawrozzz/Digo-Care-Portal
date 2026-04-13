/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";

export const toFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    }
    // Handle nested objects (basic)
    else if (typeof value === "object" && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    }
    // File or primitive
    else {
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

export const parseCompanyResponse = (apiResponse: any) => {
  if (!apiResponse || !Array.isArray(apiResponse.data)) {
    return [];
  }
  return apiResponse.data.map((item: any) => {
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
      created_at: toDateFormat(attr.created_at),
      updated_at: toDateFormat(attr.updated_at),
    };
  });
};
