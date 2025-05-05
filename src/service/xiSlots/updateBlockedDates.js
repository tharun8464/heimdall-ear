import {defaultSecuredAxios} from "../DefaultSecuredAxiosInstance"

export const updateBlockedDates = data => {
    return defaultSecuredAxios.put("/updateXiBlockedDate", {blockedDates : data});
}