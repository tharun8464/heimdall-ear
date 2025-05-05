import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";
import axios from "axios";
const url = process.env.REACT_APP_BACKEND_URL;

export const getVmProReport = (data) => {
    //console.log("data", data)
    return defaultSecuredAxios.post(`/report/vmpro`, data);

    // return axios.get(
    //     `${url}/report/vmpro`,

    //     data,

    //   );
};


