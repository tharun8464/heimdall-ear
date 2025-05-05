import {defaultSecuredAxios} from "../DefaultSecuredAxiosInstance"

export const getDateSlots = data => {
    return defaultSecuredAxios.post("/getDateSlot", {date : data});
}