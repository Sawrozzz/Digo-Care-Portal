/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "../api";

export const getFromApi = (url: string, params?: any) => {
  return request("GET", url, null, { params });
};

export const postToApi = (url: string, data: any) => {
  return request("POST", url, data);
};

export const updateToApi = (url: string, data: any) => {
  return request("PUT", url, data);
};

export const patchToApi = (url: string, data?: any) => {
  return request("PATCH", url, data);
};

export const deleteFromApi = (url: string) => {
  return request("DELETE", url);
};

export const BASE_URL = import.meta.env.VITE_BASE_URL;
