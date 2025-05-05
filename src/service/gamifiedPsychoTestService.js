import axios from "axios";
const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;

export const psycholinguisticsTestLevel1 = (data, headers) => {
  return axios.post(url + "/psycholinguistics/level1", data, {
    headers,

  });
};

export const psycholinguisticsTestLevel3 = (data, headers) => {
  return axios.post(url + "/psycholinguistics/level3", data, {
    headers,
    // timeout: 5000,
  });
};
