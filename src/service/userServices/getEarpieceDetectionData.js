import axios from "axios";
const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;

export const getEarpieceDetectionData = (data, headers) => {
  return axios.post(url + "/ear/baselining", data, { headers });
};
