import axios from "axios";
import createSecureAxiosClient from "./SecuredAxiosInstanceProvider";

export const url = process.env.REACT_APP_BACKEND_URL;
export const defaultSecuredAxios = createSecureAxiosClient(url);
export const CHALLENGE_URL = `/challenge`;
export const CHALLENGE_TRAIT_URL = `/challenge/trait`;

const COGNITION_URL = process.env.REACT_APP_COGNITION_URL;
const COGNITION_API_KEY = process.env.REACT_APP_COGNITION_API_KEY;
const COGNITION_API_KEY_LABEL =process.env.REACT_APP_COGNITION_API_KEY_LABEL;


export const createChallenge = (data) => {
    return defaultSecuredAxios.post(`${url}/${CHALLENGE_URL}/add`, data);
  };
  
export const getChallenge = () => {
    return defaultSecuredAxios.post(`${url}/${CHALLENGE_URL}`);
  };
  
export const getChallengeByUserId = (userId) => {
    //console.log"getChallengeByUserId: ",`${url}${CHALLENGE_URL}/${userId}`);
    return defaultSecuredAxios.post(`${url}${`/challengeByUserId`}/${userId}`);
  };

export const addUserGameData = (data, challengeId) => {
    return defaultSecuredAxios.post(`${url}/${CHALLENGE_URL}/game/add/${challengeId}`, data);
};


export const getCandidateReport = (headers, data) => {
  return axios.post(`${COGNITION_URL}/get-profile-report`, data, {
    headers: {
      [COGNITION_API_KEY_LABEL]: COGNITION_API_KEY,
    },
  });
};

export const getListOfGames = () => {
    const headers = {
      [COGNITION_API_KEY_LABEL]: COGNITION_API_KEY,
    };
    return axios.get(`${COGNITION_URL}/list-games`, { headers});
  };
   
  export const processReport = (userId) => {
    try{
      return defaultSecuredAxios.post(`/cognitive/report/${userId}`);
    }catch(err){
      return err.response;
    }
    
  };



  
