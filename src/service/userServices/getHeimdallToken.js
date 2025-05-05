import axios from "axios";
const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;

export const getHeimdallToken = (headers) => {
  return axios.post(url + "/token/generate_token", null, {
    headers,
  });
};
