// Components
import JourneyContainer from "../../Components/SignInAndSignUp/JourneyContainer";
import SignInForm from "../../Components/SignInAndSignUp/SignInForm";
import { useNavigate } from "react-router-dom";
import React from "react";

// Assets
import logogreen from "../../assets/images/Login/VMLogo.png";
import getStorage, { setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
import { useEffect } from "react";
import { getConfigDetails, getUserByToken } from "../../service/api";

const SignIn = () => {
  const [login, showLogin] = React.useState(true);
  const navigate = useNavigate();


  React.useEffect(() => {
    const initial = async () => {
      let access = await getStorage("access_token");
      //let version = await getSessionStorage("vm_version");
      //let user = JSON.parse(await getStorage("user"));
      //let version = getSessionStorage("vm_version");
      let user = null;
      if (access) {
        const data = { access_token: access };
        const res = await getUserByToken(data);
        setSessionStorage("vm_version", '0.1');
        setSessionStorage("user_type", res?.data?.user?.user_type)
        setSessionStorage("user", JSON.stringify(res?.data?.user));
        user = res?.data?.user;
      }

      //console.log("signIn page==============")
      if (user) {
        await getConfigDetails();

      }
      if (
        (access && user)
      ) {
        if (user.isAdmin) {
          navigate("/admin?a=" + access);
        }
        if (user.user_type === "Company") {
          navigate("/company?a=" + access);
        }
        if (user.user_type === "XI") {
          navigate("/XI?a=" + access);
        }
        if (user.user_type === "User") {
          navigate("/user?a=" + access);
        }
      }
    };
    initial();
  });


  return (
    <div className="flex flex-row bg-white w-full h-screen overflow-hidden text-left text-sm text-dark-50 font-button">
      <JourneyContainer />
      <div className="h-full lg:w-[63%] md:w-[100%] sm:w-[100%] xs:w-[100%]">
        <div className="absolute top-[50px] left-[50px]">
          <img
            className="left-[40px] w-[70.12px] h-[30px] object-cover lg:hidden md:flex sm:hidden xs:hidden"
            alt=""
            src={logogreen}
          />
        </div>
        <div className="flex h-full m-auto lg:w-[60%]  md:w-[60%] sm:w-[90%] xs:w-[90%]">
          <div className="flex flex-col justify-between w-full h-[100%] mt-auto mb-auto lg:overflow-y-[unset] md:overflow-y-[unset] sm:overflow-y-auto xs:overflow-y-auto">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
