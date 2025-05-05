import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance"

export const deleteSlots = (slotId) => {
    return defaultSecuredAxios.post(`/deleteSlot/${slotId}`);
}


export const markUnavailableSlots = (unavailableDate) => {
    return defaultSecuredAxios.post(`/unavailableSlot/${unavailableDate}`);
}