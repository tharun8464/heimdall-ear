import React from "react";
import { ReactSession } from "react-client-session";

// Components
import SignupForm from "../Components/Login/SignUpForm.jsx";
import LoginForm from "../Components/Login/LoginForm.jsx";

// Assets
import styles from "../assets/stylesheet/login.module.css";
import jsCookie from "js-cookie";

const AdminLogin = () => {
  
  ReactSession.set("access_token", null);
  jsCookie.set("access_token", null);
  ReactSession.set("user", null);
  const [login, showLogin] = React.useState(true);

  return (
    <div className={styles.loginLanding}>
      {/* Login Card */}
      <div className="container w-3/4 flex bg-white rounded-lg">
        {!login && (    
          <div className="md:w-1/2 w-full flex flex-col">
            <SignupForm admin/>
            <p className="py-5 text-center text-sm block">
              Already have an account ?{" "}
              <span
                className="text-blue-700 font-semibold cursor-pointer"
                onClick={() => showLogin(true)}
              >
                {" "}
                Log In{" "}
              </span>
            </p>
          </div>
        )}
        {/* Card 1 */}
        <div className="w-1/2 m-0 md:block hidden">
          <div className={styles.Card1}></div>
        </div>
        {/* Card 2 */}
        {login && (
          <div className="md:w-1/2 w-full flex flex-col">
            <LoginForm admin />
          </div>
        )}
      </div>
      {/* Login Card */}
    </div>
  );
};

export default AdminLogin;
