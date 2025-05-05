// Assets
import { IoIosArrowBack } from "react-icons/io";
import React, { useState, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import ls from 'localstorage-slim';
import swal from "sweetalert";
import {
  authenticateSignUp,
  validateSignupDetails,
  url,
  countryCodeList,
  findCompanyById,
  getUserIdFromToken,
  getUserFromId,
} from "../../service/api";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Dialog, Transition } from "@headlessui/react";
import data from "../Login/termsAndConditions.json";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
import { AiOutlineUp } from "react-icons/ai";
import { getStorage, removeStorage, setStorage, setSessionStorage } from "../../service/storageService";


const CreatePasswordForm = ({ accountType }) => {

  const [signupError, setSignupError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisiblee, setIsPasswordVisiblee] = useState(false);
  const [password, setPassword] = useState('');
  const [verifypassword, setVerifyPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [modal, setModal] = React.useState(false);
  const [expandButton, setExpandButton] = React.useState(false);
  const [expandButtonIndex, setExpandButtonIndex] = React.useState(null);

  const location = useLocation();
  const { state } = location;
  const firstName = state && state.firstName;
  const signStatus = state && state.signStatus;
  const lastName = state && state.lastName;
  const contact = state && state.contact;
  const email = state && state.email;
  const companyName = state && state.companyName;
  const companyId = state && state.companyId;
  const countryCode = state && state.countryCode;
  const username = state && state.username;


  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleCheckBoxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleInputText = (event, setStateFunction, setErrorFunction) => {
    setStateFunction(event.target.value);
    // Clear the error when the user starts typing
    setErrorFunction('');
  };


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const togglePasswordVisibilityy = () => {
    setIsPasswordVisiblee(!isPasswordVisiblee);
  };
  const showError = (message) => {

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

  const handleSignUp = () => {
    // Check if the first name is blank

    if (/\s/.test(password)) {
      showError('Password should not contain spaces');
      return;
    }

    if (password.length < 8) {
      showError('Password should have at least 12 characters');
      return;
    }

    let hasUpperCase = /[A-Z]/.test(password);
    let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    let hasNumber = /[0-9]/.test(password);

    // Check if all conditions are met
    if (!hasUpperCase || !hasSpecialChar || !hasNumber) {
      showError('Password should contain one uppercase letter, one special character, and one number');
      return;
    }

    if (password !== verifypassword) {
      // Passwords do not match, handle the error or show a message
      showError('Passwords dont match');
      return;
    }

    if (!isChecked) {
      // Checkbox is not checked, handle the error or show a message
      showError('Please check our terms and conditions');
      return;
    }
    let values;
    if (signStatus === "User") {
      values = {
        agree: true,
        contact: contact,
        countryCode: countryCode,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        user_type: "User",
        username: username,
      };
    } else if (signStatus === "Company") {
      values = {
        agree: true,
        contact: contact,
        countryCode: countryCode,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        user_type: "Company",
        companyName: companyName,
        companyId: companyId,
      };
    } else {
      // Handle the case where status is neither "Company" nor "User"
      values = {}; // or some default values
      return;
    }


    signup(values);

  };


  const signup = async (values) => {

    let res = await authenticateSignUp(values);
    setLoading(true);


    if (res && !res.data.Error) {
      swal({
        title: "Sign Up",
        text: "Signup Successfull",
        icon: "success",
        button: "Continue",
      }).then(async () => {
        let user = res.data.user;
        let access = res.data.access_token;
        let refreshToken = res?.data?.refresh_token;
        let user_id = await getUserIdFromToken({ access_token: access });
        if (user_id) {
          let user = await getUserFromId({ id: user_id?.data?.user?.user }, access);
          if (user?.data?.user?.access_valid === false) navigate("/login");
          //await setStorage("user", JSON.stringify(user?.data?.user));
          setSessionStorage("user", JSON.stringify(user?.data?.user));
          // window.history.pushState({ url: "/company" }, "", "/company");

        }

        setStorage("access_token", access);
        setStorage("refresh_token", refreshToken);
        //setSessionStorage("vm_version", '0.1');
        //setStorage("user_type", user?.user_type)

        setSessionStorage("vm_version", '0.1');
        setSessionStorage("user_type", user?.user_type)
        if (user.user_type === "User")
          window.location.href = "/login";
        else if (
          user.user_type === "Company" ||
          user.user_type === "Company_User"
        )
          window.location.href = "/login";
        else if (user.user_type === "XI")
          window.location.href = "/XI/?a=" + access;
        else if (user.isAdmin) window.location.href = "/admin/?a=" + access;
      });
    } else if (res) {
      setSignupError(res.data.Error);

    } else {

      setSignupError("Error Signing Up");


    }
    setLoading(false);


  };

  return (
    <div className="absolute lg:w-[37.08%] md:w-[60%] sm:w-[90%] xs:w-[90%] lg:left-[50.63%] md:left-[20%] sm:left-[5%] sm:right-[5%] xs:left-[5%] xs:right-[5%] flex flex-col items-start justify-between h-full text-5xl">
      <div className="w-full mt-[15%] mb-auto flex flex-col lg:h-[53%] md:h-[53%] sm:h-[90%] xs:h-[90%] lg:gap-[40px] md:gap-[40px] sm:gap-[40px] xs:gap-[40px] justify-between">
        <div className="flex flex-col justify-between lg:mt-[unset] md:mt-[unset] sm:mt-[20%] xs:mt-[20%] gap-[20px]">
          <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
            <button
              className="lg:flex md:flex sm:hidden xs:hidden cursor-pointer [border:none] p-0 bg-[transparent] relative w-[71px] h-[17px] focus:outline-none lg:self-start md:self-center sm:self-start xs:self-start"
              onClick={handleNavigateBack}
            >
              <IoIosArrowBack className="absolute top-[0px] left-[0px] w-[17px] h-[22px] text-[#228276]" />
              <div className="absolute top-[0px] left-[0px] w-[71px] h-[17px]">
                <div className="absolute h-full w-[66.2%] top-[0%] right-[0%] bottom-[0%] left-[33.8%]">
                  <div className="absolute top-[0%] left-[0%] text-sm font-medium font-button text-[#228276] text-left">
                    Back
                  </div>
                </div>
                <img
                  className="absolute h-[94.12%] w-[22.54%] top-[0%] right-[77.46%] bottom-[5.88%] left-[0%] max-w-full overflow-hidden max-h-full hidden"
                  alt=""
                  src="/profile2.svg"
                />
              </div>
            </button>
            <div className="md:block lg:block sm:hidden xs:hidden lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold md:text-2xl">
              Sign up to ValueMatrix
            </div>
            <div className="lg:hidden md:hidden sm:block xs:block lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold sm:text-2xl xs:text-2xl">
              Sign up
            </div>
            <h5 className="m-0 lg:self-stretch md:self-center  sm:self-center xs:self-center relative text-sm font-medium font-inherit">
              Create a Strong Password
            </h5>
          </div>
          <div className="flex flex-col h-full justify-between mt-[30px]">
            <div className="flex flex-col w-full justify-between">
              <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-sm">
                <div className="self-stretch flex flex-row items-center justify-start">
                  <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                    Password
                  </h5>
                </div>

                <div className="ralative w-full">
                  <input
                    className="font-button text-sm bg-whitesmoke-200 self-stretch w-full rounded-lg overflow-hidden flex flex-col py-3 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] relative"
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="8+ characters"
                    value={password}
                    onChange={(event) => handleInputText(event, setPassword, setPasswordError)}
                    onCopy={(e) => e.preventDefault()}
                  />

                </div>




              </div>
            </div>
            <div className="flex flex-col w-full mt-3 justify-between">
              <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-sm">
                <div className="self-stretch flex flex-row items-center justify-start">
                  <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                    Confirm Password
                  </h5>
                </div>




                <div className="ralative w-full">
                  <input
                    className="font-button text-sm bg-whitesmoke-200 self-stretch w-full rounded-lg overflow-hidden flex flex-col py-3 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] relative"
                    type={isPasswordVisiblee ? 'text' : 'password'}
                    placeholder="Enter password again"
                    value={verifypassword}
                    onChange={(event) => handleInputText(event, setVerifyPassword, setConfirmError)}
                  />
                  <span
                    className="visibility-icon"
                    onClick={togglePasswordVisibilityy}
                    style={{ position: 'relative', left: '95%', top: '-50%', transform: 'translateY(-50%)', zIndex: 10 }}
                  >
                    {isPasswordVisiblee ? '👁️' : '👁️‍🗨️'}
                  </span>
                </div>
              </div>
            </div>
            <div className="self-stretch w-full flex flex-col gap-3">
              <div className="flex flex-row gap-4">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckBoxChange}
                />

                <span className="m-0 self-stretch relative text-[inherit] font-semibold font-inherit text-sm"
                  onClick={() => setModal(true)}
                >
                  <span >Agree to</span>{' '}
                  <span className="text-[#228276] cursor-pointer">T&C</span>{' '}
                  <span className="text-[#228276] cursor-pointer">and</span>{' '}
                  <span className="text-[#228276] cursor-pointer">Privacy Policy</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col items-start justify-between text-sm gap-[2vh] ">
          <div className="w-full flex flex-col">
            <button
              className="cursor-pointer [border:none] py-3 px-5 bg-[#228276] rounded-lg overflow-hidden flex flex-row items-center justify-center lg:self-start md:self-center lg:w-[unset] md:w-[unset] sm:w-full xs:w-full"
              to="/resetPassword"
              onClick={handleSignUp}
            >
              <div className="relative text-sm font-semibold font-button text-white text-left">
                Create Account
              </div>
            </button>
          </div>
        </div>
        {modal && (
          <Transition
            appear
            show={modal}
            as={Fragment}
            className="relative z-10 w-full "
            style={{ zIndex: 1000 }}
          >
            <Dialog
              as="div"
              className="relative z-10 w-5/6 "
              onClose={() => { }}
              static={true}
            >
              <div
                className="fixed inset-0 bg-black/30"
                aria-hidden="true"
              />
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto ">
                <div className="flex min-h-full items-center justify-center p-4 text-center max-w-6xl m-auto">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-[95vh]">
                      <div className={`${!modal ? "hidden" : "block"} h-full`}>
                        <div className="w-full h-full">
                          <div className="w-full h-full">
                            <div className="">
                              <div className="my-6 px-4 w-3/4 md:w-full text-left flex justify-between">
                                <div className="mt-auto mb-auto">
                                  <p className="font-semibold text-[#333333]">Terms of services</p>
                                </div>
                                <div className="">
                                  <AiOutlineClose className="cursor-pointer"
                                    onClick={() => {
                                      setModal(false);
                                      setExpandButton(false);
                                      setExpandButtonIndex(null);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="h-[83vh] overflow-y-scroll">
                              {data.map((details, index) => {
                                return (
                                  <div className="w-full bg-[#FFFFFF] flex flex-col justify-between"
                                    onClick={() => {
                                      setExpandButton(!expandButton);
                                      setExpandButtonIndex(index);
                                    }}
                                  >
                                    <div className="flex flex-row justify-between hover:border-b cursor-pointer px-4  py-3 hover:shadow ">
                                      <div className="mt-auto mb-auto">
                                        <p >{details.title}</p>
                                      </div>
                                      <span >
                                        {expandButton === true && expandButtonIndex === index ? (
                                          <>
                                            <AiOutlineUp />
                                          </>
                                        ) : (
                                          <>
                                            <AiOutlineDown />
                                          </>
                                        )}
                                      </span>
                                    </div>
                                    {expandButton === true && expandButtonIndex === index ? (
                                      <>
                                        <div className="overflow-x-auto py-3 px-4 bg-[#FAFAFA]">
                                          <p>
                                            {data[expandButtonIndex].descrption.split("\n").map(item => <div>{item}</div>)}
                                          </p>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                      </>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </div>
    </div>
  )
}

export default CreatePasswordForm;