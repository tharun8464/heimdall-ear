import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getTeamCompatibilityById = (company_id , data) =>{
 // Assuming there is only one key in the data object
    const modifiedData = {
        linkedinURL: data.linkedinUrl,
        jobId:data.jobId
    };
    return defaultSecuredAxios.post(`/pod/compatibility/${company_id}` ,  modifiedData)
}