/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./axios";
import { toFormData } from "../utils/appUtils";

export const hasFile = (obj: any): boolean => {
  if (!obj || typeof obj !== "object") return false;

  return Object.values(obj).some((value) => {
    if (value instanceof File || value instanceof Blob) return true;

    if (typeof value === "object" && value !== null) {
      return hasFile(value);
    }

    return false;
  });
};

export const request = async (
  method: string,
  url: string,
  data?: any,
  config = {}
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
