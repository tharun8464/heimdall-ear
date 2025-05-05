import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const deletePod = (podId) => {
  return defaultSecuredAxios.delete(`/deletePod/${podId}`);
};
