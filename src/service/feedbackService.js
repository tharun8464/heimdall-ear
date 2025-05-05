import axios from "axios";
import createSecureAxiosClient from "./SecuredAxiosInstanceProvider";

export const url = process.env.REACT_APP_BACKEND_URL;

const securedAxiosInstance = createSecureAxiosClient(url);

// Save the skills rating
export const updateSkillsFeedbackAPI = async (interviewId,skillsFeedback) => {
    try {
      return await securedAxiosInstance.post(`/feedback/skills/${interviewId}`,skillsFeedback);
    } catch (err) {
      return err?.response;
    }
  };			
  