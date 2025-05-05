import createSecureAxiosClient from "./SecuredAxiosInstanceProvider";

export const url = process.env.REACT_APP_BACKEND_URL;
export const defaultSecuredAxios = createSecureAxiosClient(url);
