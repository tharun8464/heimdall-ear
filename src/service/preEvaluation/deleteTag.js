import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const deleteTag = (data, headers) => {
  //console.log("rentem",data)
  return defaultSecuredAxios.post("/deleteTag", data, { headers });
};
