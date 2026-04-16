import { getFromApi } from "../../utils";

export const getSingleCompany = (id: number) => {
  getFromApi(`/companies/${id}`);
};

export const getALLCompany = () => {
  getFromApi("/companies");
};
