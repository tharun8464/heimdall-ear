import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getXiBlockedDates = () => {
  return defaultSecuredAxios.get(`/getBlockedDateOfXi` );
};
