/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./axios";
import { toFormData } from "../utils/appUtils";

const hasFile = (data: any): boolean => {
  if (!data) return false;

  return Object.values(data).some(
    (value) =>
      value instanceof File ||
      (Array.isArray(value) && value.some((v) => v instanceof File)),
  );
};

export const request = async (
  method: string,
  url: string,
  data?: any,
  config = {},
) => {
  try {
    let payload = data;
    let headers = {};

    if (hasFile(data)) {
      payload = toFormData(data);
      headers = { "Content-Type": "multipart/form-data" };
    }
    const response = await apiClient({
      method,
      url,
      data: payload,
      headers,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
