import { defaultSecuredAxios } from "../../DefaultSecuredAxiosInstance";
import axios from "axios";
const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;

export const getCultExp = (data, headers) => {
    return axios.post(
        `${url}/aggregation/experience`,
    
        data,
        {
          headers,
        }
      );
};