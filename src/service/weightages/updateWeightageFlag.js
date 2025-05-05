

import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateWeightageFlag = (weightageId,jobId) => {
    try{
        return defaultSecuredAxios.post(`/updateWeightageFlag/${weightageId}`,{jobId});
    }catch(error){
        return error.response;
    }
  
}

export const updateWeightage = (weightageId,weightageData) => {
    try{       
        return defaultSecuredAxios.post(`/updateWeightage/${weightageId}`,weightageData);
    }catch(error){
        return error.response;
    }
  
}