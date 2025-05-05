import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const addTags = (data, headers) => {
  return defaultSecuredAxios.post("/addTags", data, { headers });
};

