import axios from "axios";
const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;

export const getGazeDetectionData = (data, headers) => {
  return axios.post(url + "/gaze/baselining", data, { headers });
};
