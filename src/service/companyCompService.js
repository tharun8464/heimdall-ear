import axios from "axios";
import createSecureAxiosClient from "./SecuredAxiosInstanceProvider";

export const url = process.env.REACT_APP_BACKEND_URL;

const securedAxiosInstance = createSecureAxiosClient(url);

// Save the skills rating
export const getcompanyById = async (companyId) => {
    try {
      return await securedAxiosInstance.post(`/getCompetitorById/${companyId}`);
    } catch (err) {
      return err?.response;
    }
  };			
  