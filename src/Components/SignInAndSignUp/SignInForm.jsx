import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

// Assets
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import { adminLogin, authenticateLogin, getConfigDetails, getUserFromId, getUserIdFromToken, url } from "../../service/api";
import logo from "../../assets/images/logo.png"
import CircularProgress from '@mui/material/CircularProgress';
import ls from 'localstorage-slim';
import { getStorage, removeStorage, setStorage, setSessionStorage, getSessionStorage } from "../../service/storageService";
import { useNavigate } from "react-router-dom";
import logogreen from "../../assets/images/Login/VMLogo.png";

const SignInForm = (props) => {

  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState(null);
  const [usernameError, setUsernameError] = React.useState(null);
  const [passwordError, setPasswordError] = React.useState(null);
  const [captchaError, setCaptchaError] = React.useState(null);
  const [error, setError] = React.useState(0);
  const [captcha, setCaptcha] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const captchaRef = React.useRef();
  const navigate = useNavigate();

  const showError = (message) => {
    //console.log('showToast message:', message);
    const customStyle = {
      fontSize: '12px', // Adjust the font size as needed
    };

    toast.error(message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: customStyle,
    });
  };


  const Login = async (values) => {
    if (captcha === false && error >= 3) {
      setCaptchaError("Confirm Captcha");
      return;
    } else {
      setCaptchaError(null);
    }
    let res = null;
    setLoading(true);
    if (props.admin) res = await adminLogin(values);
    else res = await authenticateLogin(values);
    //let access = res?.headers?.access;
    //let version= res?.headers?.vmversion;  
    let access = res?.data?.access_token;
    let refreshToken = res?.data?.refresh_token;
    let user = res?.data?.user;
    if (res && res.status === 200) {
      await getConfigDetails();
      // const configDetails = await getConfigDetails(res?.data?.user?.company_id);
      // setSessionStorage("configurations", JSON.stringify(configDetails?.data?.configDetails));
      setCaptcha(true);
      setCaptchaError(null);
      setLoading(false);
      //console.log("===================================loginSuccessfully============================");
      //console.log(res.data);
      //console.log("===========================================userDetails ENd====================================");
      setStorage("access_token", access);
      setStorage("refresh_token", refreshToken);
      //setSessionStorage("vm_version", '0.1');
      //setStorage("user_type", res?.data?.user?.user_type)
      //setStorage("user", JSON.stringify(res?.data?.user));

      //for session storage
      setSessionStorage("vm_version", '0.1');
      setSessionStorage("user_type", res?.data?.user?.user_type)
      setSessionStorage("user", JSON.stringify(res?.data?.user));

      if (res?.data?.user?.invite) {
        navigate("/setProfile/" + res?.data?.user?.resetPassId);
      } else if (res.data.user.user_type === "User")
        window.location.href = "/user";
      else if (
        res?.data?.user?.user_type === "Company" ||
        res?.data?.user?.user_type === "Company_User"
      ) {
        window.location.href = "/company";
      }
      else if (res?.data?.user?.user_type === "XI" || res?.data?.user?.user_type === "SuperXI")
        window.location.href = "/XI";
      else if (
        res?.data?.user?.isAdmin ||
        res?.data?.user?.user_type === "Admin_User"
      ) {
        navigate("/admin");
      }

    } else {
      setCaptcha(false);
      if (captchaRef.current !== undefined) {
        captchaRef.current.reset();
      }
      let e = error + 1;
      setError(e);
      if (error >= 3) {
        setCaptcha(false);
      }

      showError('Credentials dont match');
      // setLoginError('whaaaaaaaaaaaat')
      setUsernameError('Please enter a valid email address');
      setPasswordError('Please enter a valid password');
      setLoading(false);
    }
  };



  return (
    <div className=" flex flex-col justify-between  lg:gap-[40px] md:gap-[40px] sm:gap-[250px] xs:gap-[250px] lg:mt-[90px] md:mt-[90px] sm:mt-10 xs:mt-10 mb-auto items-start 
      xl:h-[65%] lg:h-[75%] text-5xl lg:w-[100%] md:w-[100%] sm:w-[100%] xs:w-[100%] lg:left-[50.63%] md:left-[20%] sm:left-[5%] sm:right-[5%] xs:left-[5%]
      xs:right-[5%]">
      <div className="w-full flex flex-col  lg:gap-[30px] md:gap-[30px] sm:gap-[40px] xs:gap-[40px] justify-between h-[90%]">
        <div className="flex flex-col justify-between  lg:gap-[20px] md:gap-[10px] lg:h-[10%] md:h-[20%]">
          <div className="md:block lg:block  sm:hidden xs:hidden lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold md:text-2xl">
            Sign in to ValueMatrix
          </div>
          <div className="lg:hidden md:hidden sm:block  xs:block self-center">
            <img
              className=" w-[80.12px] h-[40px] object-cover  lg:hidden md:hidden sm:flex xs:flex "
              alt=""
              src={logogreen}
            />
          </div>
          <div className="lg:hidden md:hidden sm:block  xs:block lg:self-stretch md:self-center mt-6 sm:self-center xs:self-center relative font-semibold sm:text-2xl xs:text-2xl">
            Sign in
          </div>
          <div className="m-0 lg:self-stretch md:self-center  sm:self-center xs:self-center relative text-sm font-medium font-inherit">
            <div className="lg:flex lg:justify-center md:flex md:justify-center sm:flex sm:justify-center xs:flex xs:justify-center lg:text-[14px] md:text-[14px] sm:[12px] xs:text-[12px] gap-2">
              <span className="font-medium">
                <span>Don’t have an account?</span>
                <span className="text-dark-100">{` `}</span>
              </span>
              <span className="font-semibold font-button text-[#228276] cursor-pointer"
                onClick={() => navigate('/register')}
              >
                Sign up
              </span>
              <span className="font-medium font-button text-dark-100">{` `}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full justify-between gap-[8px] ">
          <div className="lg:flex md:flex sm:hidden xs:hidden flex-row justify-center space-x-2 h-13 self-stretch">
            <form className="w-1/3" action={`${url}/auth/google`}>
              <button type="submit" className="my-0.5 w-full ">
                {/* <div className="w-1/3">
              <button type="" className="my-0.5 w-full " onClick={e=>googleAuth()}> */}
                <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">
                  <img
                    src={Google}
                    alt="google-login"
                    className="cursor-pointer h-5 my-2"
                  />
                  <p className="text-[14px] font-semibold px-2 self-center">Google</p>
                </div>
              </button>
            </form>
            {/* <form className="w-1/3" action={`${url}/auth/microsoft`}>
              <button type="submit" className="my-0.5 w-full">
                <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">

                  <img
                    src={Microsoft}
                    alt="microsoft-login"
                    className="cursor-pointer h-5 my-2"
                  />

                  <p className="text-[14px] font-semibold px-2 self-center">Microsoft</p>
                </div>
              </button>
            </form> */}
            <form className="w-1/3" action={`${url}/auth/linkedin`}>
              <button type="submit" className="my-0.5 w-full">
                {/* <div className="w-1/3">
              <button type="" className="my-0.5 w-full" onClick={e=>linkedinAuth()}> */}
                <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">

                  <img
                    src={Linkedin}
                    alt="linkedin-login"
                    className="cursor-pointer h-5 my-2"
                  />
                  <p className="text-[14px] font-semibold px-2 self-center">Linkedin</p>
                </div>
              </button>
            </form>
          </div>
          <div class="lg:flex md:flex sm:hidden xs:hidden items-center py-4 w-full">
            <div class="flex-grow h-px" style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}></div>

            <span class="text-[14px] text-[#333333] px-4 font-light">Or</span>

            <div class="flex-grow h-px" style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}></div>
          </div>



          <Formik
            initialValues={{ username: "", password: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.username) {
                errors.username = "Required";
              }
              if (!values.password) {
                errors.password = "Required";
              }
              return errors;
            }}
            onSubmit={(values) => {
              Login(values);
            }}
          >
            {({ values, isSubmitting }) => (
              <Form className="space-y-2 ">
                <div className="">
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold">Phone or Email Address</label>
                    <div>
                      <div className="w-100 ">
                        <p className="text-sm text-blue-600 text-right font-semibold">
                          <Link to="/otplogin">Login with OTP</Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="w-full flex items-center"
                    style={{ borderRadius: "12px" }}
                  >
                    <Field
                      type="text"
                      name="username"
                      placeholder="Phone or Email Address"
                      className="w-full text-600 my-1"
                      style={{ borderRadius: "8px" }}
                      tabIndex="1"
                    />
                  </div>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-xs text-red-600"
                  />
                  {loginError && (
                    <p className="text-sm text-red-600">{loginError}</p>
                  )}
                </div>
                <div className="pt-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold">Password</label>
                    <div>
                      <div className="w-100 ">
                        <p className="text-sm text-blue-600 text-right font-semibold">
                          <Link to="/resetPassword">Forgot Password ?</Link>
                        </p>
                      </div>
                    </div>

                  </div>


                  <div
                    className="w-full flex items-center"
                    style={{ borderRadius: "12px" }}
                  >
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="w-full text-600 my-1"
                      style={{ borderRadius: "8px" }}
                      tabIndex="2"
                    />
                    <div className="relative flex items-center">
                      {showPassword ? (
                        <p
                          className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold  absolute right-3"
                          onClick={() => {
                            setShowPassword(false);
                          }}
                        >
                          <AiFillEyeInvisible className="text-xl" />
                        </p>
                      ) : (
                        <p
                          className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold absolute right-3"
                          onClick={() => {
                            setShowPassword(true);
                          }}
                        >
                          <AiFillEye className="text-xl" />
                        </p>
                      )}
                    </div>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-xs text-red-600"
                  />
                  {loginError && (
                    <p className="text-sm text-red-600">{loginError}</p>
                  )}
                </div>

                {/* <div className="flex flex-row gap-4 mt-3">
                  <input type="checkbox"></input>
                  <span className="m-0 self-stretch relative text-[inherit] font-semibold font-inherit text-sm">Remember me</span>
                </div> */}

                {error >= 3 && (
                  <div>
                    <ReCAPTCHA
                      sitekey="6LdanHEhAAAAALDqT2CqlzJvxdPDPUDYGkcceYd7"
                      onChange={(value) => {
                        setCaptcha(true);
                      }}
                      ref={captchaRef}
                    />
                  </div>
                )}
                {captchaError && (
                  <p className="text-sm my-0 text-red-600">{captchaError}</p>
                )}
                <div className="self-stretch flex flex-col items-start  justify-between text-sm gap-[2vh] ">

                  <div className="w-full flex flex-col">
                    <div className="lg:hidden md:hidden mt-[10%] sm:flex xs:flex flex-row justify-center space-x-2 h-13 self-stretch">
                      <form className="w-1/3" action={`${url}/auth/google`}>
                        <button type="submit" className="my-0.5 w-full ">
                          <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">
                            <img src={Google} alt="google-login" className="cursor-pointer h-5 my-2" />
                            <p className="text-[14px] font-semibold px-2 self-center">Google</p>
                          </div>
                        </button>
                      </form>
                      <form className="w-1/3" action={`${url}/auth/linkedin`}>
                        <button type="submit" className="my-0.5 w-full">
                          <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">

                            <img src={Linkedin} alt="linkedin-login" className="cursor-pointer h-5 my-2" />
                            <p className="text-[14px] font-semibold px-2 self-center">Linkedin</p>
                          </div>
                        </button>
                      </form>
                    </div>
                    <div class="lg:hidden md:hidden sm:flex xs:flex items-center py-6 w-full">
                      <div class="flex-grow h-px" style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}></div>

                      <span class="text-[14px] text-[#333333] px-4 font-light">Or</span>

                      <div class="flex-grow h-px" style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}></div>
                    </div>
                  </div>
                </div>
                {!loading && (
                  <button
                    className="bg-emerald-700 px-4 py-2 text-white rounded-md font-bold text-lg   mx-auto hover:bg-emerald-700 text-center   lg:w-[unset] md:w-[unset] sm:w-full xs:w-full cursor-pointer"
                    type="submit"
                    style={{ backgroundColor: "#228276" }}
                  >
                    Log In
                  </button>
                )}
                {loading && (
                  <button className="bg-emerald-700 px-4 py-2 text-white rounded-md font-bold text-lg   mx-auto hover:bg-emerald-700 lg:self-start md:self-center text-center lg:w-[unset] md:w-[unset] sm:w-full xs:w-full cursor-pointer"
                    style={{ backgroundColor: "#228276" }}>
                    <CircularProgress size={20} />
                  </button>
                )}
              </Form>
            )}
          </Formik>


        </div>
      </div>
    </div>
  )
}

export default SignInForm;