import axios from "axios";
const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;

export const getCultureMatch = (data, headers) => {
  return axios.post(
    // `${url}/aggregation/culturematch`,
    `${url}/company/culture/match`,

    data,
    {
      headers,
    }
  );
};
