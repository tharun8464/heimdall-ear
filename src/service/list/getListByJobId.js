import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getListByJobId = (id) => {
    return defaultSecuredAxios.post(`/getListByJobId/${id}`);
};