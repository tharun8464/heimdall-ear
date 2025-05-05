import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const createCandidatesList = (data) => {
    return defaultSecuredAxios.post(`/createList`, data);
};