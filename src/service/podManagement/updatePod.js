import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updatePod = (podId, data) => {
  return defaultSecuredAxios.post(`/podupdate/${podId}`, data);
};
