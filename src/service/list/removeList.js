import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const removeList = (data) => {
    return defaultSecuredAxios.post(`/removeList`, data);
};