import axios from "axios";
import getStorage, { removeStorage, setStorage, removeSessionStorage } from "./storageService";

const createSecureAxiosClient = (baseURL) => {

  const url = process.env.REACT_APP_BACKEND_URL;
  const instance = axios.create({
    baseURL,
  });
  //const token = getStorage("access_token", { decrypt: true });
  //instance.defaults.headers.Authorization = token ? `${token}` : "";
  //instance.defaults.headers.client_id = process.env.REACT_APP_DS_CLIENT_ID;
  //instance.defaults.headers.client_secret = process.env.REACT_APP_DS_CLIENT_SECRET;
  //return instance;

  instance.interceptors.request.use(
    (config) => {
      const token = getStorage("access_token", { decrypt: true });
      config.headers.Authorization = token ? `${token}` : "";
      //config.headers.client_id = process.env.REACT_APP_DS_CLIENT_ID;
      //config.headers.client_secret = process.env.REACT_APP_DS_CLIENT_SECRET;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = newAccessToken ? `${newAccessToken}` : "";
        //originalRequest.headers.client_id = process.env.REACT_APP_DS_CLIENT_ID;
        //originalRequest.headers.client_secret = process.env.REACT_APP_DS_CLIENT_SECRET;
        return instance(originalRequest);
      }

      return Promise.reject(error);
    }
  );

  async function refreshAccessToken() {
    let newAccessToken = null;
    try {
      const refreshToken = getStorage('refresh_token', { decrypt: true });
      newAccessToken = await axios.post(`${url}/refreshToken`,
        {
          refreshToken,
          clientId: process.env.REACT_APP_DS_CLIENT_ID,
          clientSecret: process.env.REACT_APP_DS_CLIENT_SECRET
        });

      setStorage('access_token', newAccessToken?.data?.access_token);
    } catch (error) {
      //console.log("========================refreshToken================================");
      //console.log(error);
      removeStorage("access_token");
      removeStorage("refresh_token");
      removeSessionStorage('user_type');
      window.location.href = "/login";
      return;

    }
    return newAccessToken?.data?.access_token;
  }
  return instance;
};

export default createSecureAxiosClient;
