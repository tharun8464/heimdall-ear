import axios from "axios";
import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;
//dev.valuematrix.ai/heimdall/api/aggregation/cognitivematch

export const getCognitiveMatch = (data, headers) => {
  return axios.post(`${url}/aggregation/cognitivematch`, data, {
    headers,
  });
};
