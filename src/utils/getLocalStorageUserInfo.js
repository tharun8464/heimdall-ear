import getStorage,{getSessionStorage, setSessionStorage, removeSessionStorage} from "../service/storageService";

export const getLocalStorageUserInfo = async () => {
  let user = JSON.parse(await getSessionStorage("user"));
  return user;
};
