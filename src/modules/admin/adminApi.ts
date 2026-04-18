import { getFromApi, postToApi, updateToApi, deleteFromApi } from "../../utils";

export const getAllAdmins = () => {
  return getFromApi("/admins");
};

export const getSingleAdmin = (id: number) => {
  return getFromApi(`/admins/${id}`);
};

export const createAdmin = (data: {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
}) => {
  return postToApi("/admins", { admin: data });
};

export const updateAdmin = (
  id: number,
  data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
    status?: string;
  }
) => {
  return updateToApi(`/admins/${id}`, { admin: data });
};

export const deleteAdmin = (id: number) => {
  return deleteFromApi(`/admins/${id}`);
};
