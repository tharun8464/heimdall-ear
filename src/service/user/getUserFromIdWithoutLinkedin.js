import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getUserFromIdWithoutLinkedin = id => {
    return defaultSecuredAxios.post("/getUserFromIdWithoutLinkedin", { id });
};