import axios from "axios";
import createSecureAxiosClient from "./SecuredAxiosInstanceProvider";

export const url = process.env.REACT_APP_BACKEND_URL;

const securedAxiosInstance = createSecureAxiosClient(url);

// Get the service enabled
export const verifyServiceEnabled = async (companyId, action) => {
  try {
    return await securedAxiosInstance.get(`/verifyServiceEnabled/${companyId}/${action}`);
  } catch (err) {
    return err?.response;
  }
};

export const getCompanyCredit = async (companyId) => {
  try {
    return await securedAxiosInstance.get(`/getCompanyCredit/${companyId}`);

  } catch (err) {
    return err?.response;
  }
};

export const decreaseCredit = async (companyId, action, amount) => {
  try {
    //console.log("aaaaauuudecresaecredit", companyId)
    return await securedAxiosInstance.post(`/decreaseCredit`, {
      params: {
        companyId,
        action,
        amount
      },
    });
  } catch (err) {
    return err?.response;
  }
};

export const getCreditMapByCompany = async (companyId) => {

  try {
    return await securedAxiosInstance.get(`/getCreditMapByCompany`, {
      params: {
        companyId
      },
    });
  } catch (err) {
    return err?.response;
  }
};

// Get all the traits available for cognition assessment 
export const getAllEnabledTraits = async () => {
  try {
    return await securedAxiosInstance.get(`/challenge/master/traits`);
  } catch (err) {
    return err?.response;
  }
};			
