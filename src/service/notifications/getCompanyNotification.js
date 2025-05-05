import {  defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export  const getCompanyNotification = (data) => {
    return defaultSecuredAxios.post("/getCompanyUserNotifications" , {jobId : data?.jobId , to : data?.to});
} 
