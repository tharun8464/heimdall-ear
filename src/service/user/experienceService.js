import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const addUserExperience = data => {
  return defaultSecuredAxios.post("/user/addExperience", data);
};

export const updateUserExperienceById = data => {
  //console.log("dataExp:", data);
  return defaultSecuredAxios.post("/user/updateExperience", data);
};

export const deleteUserExperience = data => {
  //console.log("data:", data);
  return defaultSecuredAxios.post("/user/deleteExperience", data);
};
