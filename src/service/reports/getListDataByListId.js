import {defaultSecuredAxios} from "../DefaultSecuredAxiosInstance"

export const getListDataByListId = (listId) => {
    return defaultSecuredAxios.post("/getReportListByListId", {listId})
}