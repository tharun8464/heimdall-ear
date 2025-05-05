import React, { useEffect } from 'react';
import getStorage, { setStorage, setSessionStorage } from "../../service/storageService";
import { socialLogin } from "../../service/api";
import { useNavigate } from 'react-router-dom';
export const SocialLogin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const initial = async (id) => {
      const res = await socialLogin(id);
      //setStorage("user", JSON.stringify(res?.data?.user));
      setStorage("access_token", res?.data?.access_token);
      setStorage("refresh_token", res?.data?.refresh_token);
      //setSessionStorage("vm_version", '0.1');
      //setStorage("user_type", res?.data?.user?.user_type)

      setSessionStorage("user", JSON.stringify(res?.data?.user));
      setSessionStorage("vm_version", '0.1');
      setSessionStorage("user_type", res?.data?.user?.user_type)
      if (res) {
        if (res?.data?.user.isAdmin) {
          navigate("/admin?a=" + res?.data?.access_token);
        }
        if (res?.data?.user.user_type === "Company") {
          navigate("/company?a=" + res?.data?.access_token);
        }
        if (res?.data?.user.user_type === "XI") {
          navigate("/XI?a=" + res?.data?.access_token);
        }
        if (res?.data?.user.user_type === "User") {
          navigate("/user?a=" + res?.data?.access_token);
        }
      }

    }
    if (id) {
      initial(id);
    }
  });

  return (
    <></>
  )
}