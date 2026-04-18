import { getFromApi } from "../../utils";

export const getSingleCompany = (id: number) => {
  getFromApi(`/companies/${id}`);
};

export const getALLCompany = () => {
  getFromApi("/companies");
};

import { deleteFromApi } from "../../utils";

export const deleteCompany = (id: number) => {
  return deleteFromApi(`/companies/${id}`);
};
