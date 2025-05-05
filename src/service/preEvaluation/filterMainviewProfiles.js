import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const filterMainViewProfiles = (data, headers) => {
  return defaultSecuredAxios.post("/filterMainViewProfiles", data);
};
