import axios from "axios";
const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;

export const getMovementDetection = async (data, headers) => {
  return await axios.post(`${url}/microexpressions/baselining`, data, { headers });
};
