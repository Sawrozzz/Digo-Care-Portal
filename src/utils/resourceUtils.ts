/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "../api";

export const get = (url: string, params?: any) => {
  return request("GET", url, null, { params });
};

export const post = (url: string, data: any) => {
  return request("POST", url, data);
};

export const put = (url: string, data: any) => {
  return request("PUT", url, data);
};

export const remove = (url: string) => {
  return request("DELETE", url);
};
