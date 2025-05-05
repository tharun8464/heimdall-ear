import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getCompanyNameById = (companyId) => {
  //console.log("aaaaaaaaaaagetCompanyNameById", companyId)
  return defaultSecuredAxios.get(`/company/${companyId}`);
};

export const getAllCompany = () => {
  return defaultSecuredAxios.get(`/getComapnyAll`);
};
