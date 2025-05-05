import axios from "axios";
const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;

export const teamDynamicsConfidence = (data, headers) => {
  return axios.post(`${url}/aggregation/teamdynamicsconf`, data, {
    headers,
  });
};
