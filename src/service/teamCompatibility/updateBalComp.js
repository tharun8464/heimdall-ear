import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateCandBalComp = (data)=>{
    return defaultSecuredAxios.post(`/updateBalComp` , data)
}