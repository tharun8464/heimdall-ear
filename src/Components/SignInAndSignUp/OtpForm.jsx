import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { ToastContainer, toast } from 'react-toastify';
import { sendSMSOTP, verifySMSOTP } from "../../service/otpService";
import { getCountryCode } from '../../service/api';
// Assets
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import { adminLogin, authenticateLogin, otpLogin, url, getUserIdFromToken, validateSignupDetails, getUserFromId } from "../../service/api";
import logo from "../../assets/images/logo.png"
import CircularProgress from '@mui/material/CircularProgress';
import ls from 'localstorage-slim';
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { getStorage, removeStorage, setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
import logogreen from "../../assets/images/Login/VMLogo.png";
import { getConfigDetails } from '../../service/api';
import { notify } from '../../utils/notify';


const OtpForm = (props) => {
    const [countryCodes, setcountryCodes] = useState([]);
    const [captchaError, setCaptchaError] = React.useState(null);
    const [error, setError] = React.useState(0);
    const [captcha, setCaptcha] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [mobileError, setMobileError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [contact, setContact] = useState('');
    const [mobileotp, setMobileotp] = useState('');
    const [mobileVerified, setMobileverified] = useState(false);
    let [seconds, setSeconds] = useState(120);
    const [isRunning, setIsRunning] = useState(false);
    const [verifySms, setverifySms] = React.useState(false);
    const [countryCode, setCountrycode] = useState('+91');
    const [SmsOTP, setSMSOTP] = React.useState(null);
    const [otpsent, setOtpsent] = useState(false);
    const [otp, setOtp] = useState('');
    const inputRefs = useRef([]);
    const supportInternationalOtp = JSON.parse(getSessionStorage("configurations"))?.supportInternationalOtp;

    useEffect(() => {
        const initial = async () => {
            await getConfigDetails();
            const res = await getCountryCode();
            if (res) {
                setcountryCodes(res.data.countryCode);
            }
        }
        initial();
    }, []);
    // Function to handle input change for each digit
    const handleInputChange = (index, event) => {
        const { value } = event.target;

        // Concatenate the entered digit to the OTP string
        const newOtp = mobileotp.substring(0, index) + value + mobileotp.substring(index + 1);
        setMobileotp(newOtp);

        // Move focus to the next input field after updating the OTP value
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Function to handle key down event for each digit



    const captchaRef = React.useRef();
    const navigate = useNavigate();


    const showToast = (message) => {
        const customStyle = {
            fontSize: '12px', // Adjust the font size as needed
        };

        toast.success(message, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: customStyle,
        });
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


    const sendSmsOTP = async (values) => {
        setIsRunning(true);
        setSeconds(120);
        setverifySms(false);
        //console.log("value", values)
        let check = await validateSignupDetails(values);
        //console.log("check", check)
        if (!check.data.contact) {

            showError('mobile no does not exist');
            setverifySms(false);
            setIsRunning(false);
            return;

        }

        // right now just send country code India. This will be updated once we have more countries
        //let countryCode;
        //if (values?.countryCode || values.countryCode.trim() === '') {
        //countryCode = "+91";
        //} else {
        //countryCode = values?.countryCode;
        // }

        let respSMSOTP = await sendSMSOTP(values?.contact, countryCode);

        if (respSMSOTP) {
            if (respSMSOTP?.status === 201) {

                showError(`${respSMSOTP?.data?.details}`);
            } else if (respSMSOTP?.status === 200) {
                setSMSOTP(respSMSOTP);
                showToast('OTP has been sent');
                setOtpsent(true);
            }
        } else {
            showError('Something went wrong. Please check if the contact is valid.');

            setverifySms(false);
            setIsRunning(false);

        }

    };


    const verifySmsOTP = async (values) => {
        if (values && values?.SmsOTP && values?.mobileotp) {
            let verifyOTPResp = await verifySMSOTP(SmsOTP?.data?.otpId, values?.SmsOTP)
            if (verifyOTPResp) {
                setMobileverified(true);
                setverifySms(true);
            } else {
                showError('Invalid contact OTP, PLease enter a valid one and retry');
            }
        }
    };



    useEffect(() => {
        let intervalId;
        if (isRunning && seconds > 0) {
            intervalId = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsRunning(false);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning, seconds]);


    const Login = async () => {

        if (captcha === false && error >= 3) {
            setCaptchaError("Confirm Captcha");
            return;
        } else {
            setCaptchaError(null);
        }
        if (mobileotp.length !== 6) {
            // If OTP is not fully filled, shake the fields
            showError('OTP invalid');
            return;
        }
        let res = null;
        setLoading(true);
        //console.log("running", SmsOTP?.data?.otpId, mobileotp, contact)
        let values = null;
        if (countryCode === '+91') {
            values = {
                otpId: SmsOTP?.data?.otpId,
                contact: contact,
                otp: mobileotp,
            };
        } else {
            values = {
                reference: SmsOTP?.data?.otpId?.reference,
                contact: contact,
                otp: mobileotp,
            };
        }
        if (props.admin) res = await adminLogin(values);
        else res = await otpLogin(values);
        //let access = res?.headers?.access;
        //let version= res?.headers?.vmversion;  
        let access = res?.data?.access_token;
        let refreshToken = res?.data?.refresh_token;
        let user = res?.data?.user;
        if (res) {
            setCaptcha(true);
            setCaptchaError(null);
            setLoading(false);

            setStorage("access_token", access);
            setStorage("refresh_token", refreshToken);
            //setSessionStorage("vm_version", '0.1');
            //setStorage("user_type", res?.data?.user?.user_type)
            //setStorage("user", JSON.stringify(res?.data?.user));

            setSessionStorage("user", JSON.stringify(res?.data?.user));
            setSessionStorage("vm_version", '0.1');
            setSessionStorage("user_type", res?.data?.user?.user_type)
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
                navigate("/admin?a=" + access);
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

            showError('OTP incorrect');
            setLoading(false);
        }
    };

    const handleMobileVerification = async () => {
        if (countryCode !== '+91' && !supportInternationalOtp) {
            notify(`Login with OTP not support for ${countryCode} ${contact}`, "error");
            return;
        }
        // Call the sendEmailOTP API       
        if (!contact) {
            setMobileError('Contact no is required');
            return;
        }

        if (contact.length < 10) {

            showError('Enter a valid number');
            return;
        }

        if (
            !/^\d+$/.test(contact)
        ) {

            showError('Enter a valid Contact no"');
            return;
        }
        //console.log(contact, countryCode)
        setMobileError('');
        await sendSmsOTP({ contact, countryCode });
    };

    const handleSubmitCode = async () => {
        // Call the verifyEmailOTP API
        await Login({ SmsOTP: mobileotp, mobileotp });
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && index > 0 && !mobileotp[index]) {
            // Move focus to the previous input field if Backspace is pressed
            inputRefs.current[index - 1].focus();
        } else if (event.key === 'Enter') {
            // Trigger the button click based on whether OTP is sent or not
            if (otpsent) {
                // If OTP is sent, trigger the login button click
                Login();
            } else {
                // If OTP is not sent, trigger the Send OTP button click
                handleMobileVerification();
            }
        }
    };

    const handleInputText = (event, setStateFunction, setErrorFunction) => {
        setStateFunction(event.target.value);
        // Clear the error when the user starts typing
        setErrorFunction('');
    };

    const handleNavigateBack = () => {
        navigate(-1);
    };

    const handleChangeCountryCode = (e) => {
        setCountrycode(e.target.value);
    }
    return (
        <div className=" flex flex-col justify-between  lg:gap-[40px] md:gap-[40px] sm:gap-[250px] xs:gap-[250px]   lg:mt-[90px] md:mt-[90px] sm:mt-10 xs:mt-10 mb-auto items-start xl:h-[65%] lg:h-[75%] text-5xl lg:w-[100%] md:w-[100%] sm:w-[100%] xs:w-[100%] lg:left-[50.63%] md:left-[20%] sm:left-[5%] sm:right-[5%] xs:left-[5%] xs:right-[5%]">
            <div className="w-full flex flex-col  lg:gap-[30px] md:gap-[30px] sm:gap-[30px] xs:gap-[30px] justify-between h-[90%]">
                <div className="flex flex-col justify-between  lg:gap-[20px] md:gap-[10px] lg:h-[10%] md:h-[20%]">
                    <div className="md:block lg:block sm:hidden xs:hidden lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold md:text-2xl ">
                        Sign in to ValueMatrix
                    </div>
                    <div className="lg:hidden md:hidden sm:block  xs:block self-center">
                        <img
                            className=" w-[80.12px] h-[40px] object-cover  lg:hidden md:hidden sm:flex xs:flex "
                            alt=""
                            src={logogreen}
                        />
                    </div>
                    <div className="lg:hidden md:hidden sm:block xs:block mt-6 lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold sm:text-2xl xs:text-2xl">
                        Sign in
                    </div>
                    <div className="m-0 lg:self-stretch md:self-center  sm:self-center xs:self-center relative text-sm font-medium font-inherit">
                        <div className="lg:flex lg:justify-start md:flex md:justify-center sm:flex sm:justify-center xs:flex xs:justify-center lg:text-[14px] md:text-[14px] sm:[12px] xs:text-[12px] gap-2">
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
                <div className="flex flex-col w-full justify-between gap-[10px] ">
                    <div className="lg:flex md:flex sm:hidden xs:hidden flex-row justify-center space-x-2 h-13 self-stretch">
                        <form className="w-1/3" action={`${url}/auth/google`}>
                            <button type="submit" className="my-0.5 w-full ">
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

                        <form className="w-1/3" action={`${url}/auth/linkedin`}>
                            <button type="submit" className="my-0.5 w-full">
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



                    <div className="flex flex-col h-full justify-between mt-[30] gap-[20px]">
                        <div className="flex flex-col w-full justify-between">
                            <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-sm">
                                <div className="self-stretch flex flex-row items-center justify-between">
                                    <div className="flex flex-row w-80">
                                        <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                                            Mobile Number
                                        </h5>
                                    </div>
                                    <div className=" ">
                                        <p className="text-sm text-blue-600 text-right font-semibold">
                                            <Link to="/login">Login with Password</Link>
                                        </p>
                                    </div>
                                </div>

                                <div className="relative w-full flex flex-row items-center justify-start">
                                    <div className="w-60">
                                        <select
                                            id="countryCodeSelect"
                                            onChange={e => handleChangeCountryCode(e)}
                                            name="countryCode"
                                            value={countryCode}
                                            className="border-[0.5px] rounded-lg  border-gray-400 w-5"
                                            style={{ width: "130px", height: "50px" }}
                                        >
                                            {countryCodes?.map((item) => (
                                                <option key={item?._id} value={item.code}>
                                                    {item.iso}  {item.code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='w-100'>
                                        <input
                                            className="font-button text-sm bg-whitesmoke-200 self-stretch w-full rounded-lg overflow-hidden flex flex-col py-3 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] relative"
                                            type="tel"
                                            placeholder={mobileError ? `${mobileError}` : 'Phone Number'}
                                            maxLength={10}
                                            value={contact}
                                            disabled={otpsent}
                                            onChange={(event) => handleInputText(event, setContact, setMobileError)}
                                            onKeyDown={(event) => {
                                                // Allow only numeric characters and special keys like backspace, delete, arrow keys
                                                if (!/[0-9]/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(event.key)) {
                                                    event.preventDefault();
                                                } else if (event.key === 'Enter') {
                                                    // Trigger the button click based on whether OTP is sent or not
                                                    if (otpsent) {
                                                        // If OTP is sent, trigger the login button click
                                                        Login();
                                                    } else {
                                                        // If OTP is not sent, trigger the Send OTP button click
                                                        handleMobileVerification();
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>




                            </div>
                        </div>
                        {otpsent && (<div className="flex flex-col w-full justify-between ">
                            <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-sm">
                                <div className="self-stretch flex flex-row items-center justify-start">
                                    <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                                        OTP
                                    </h5>
                                </div>

                                <div className="ralative w-full">
                                    {/* <input
                                        className="font-button text-sm bg-whitesmoke-200 self-stretch w-full rounded-lg overflow-hidden flex flex-col py-3 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] relative"
                                        type="text"
                                        placeholder={otpError ? `${otpError}` : 'OTP'}
                                        value={mobileotp}
                                        onChange={(event) => handleInputText(event, setMobileotp, setOtpError)}
                                    /> */}

                                    {[...Array(6)].map((_, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            className="font-button text-sm bg-whitesmoke-200  rounded-lg   border-[2px] border-solid border-[#E3E3E3] relative"
                                            value={mobileotp[index] || ''}
                                            onChange={(event) => handleInputChange(index, event)}
                                            onKeyDown={(event) => handleKeyDown(index, event)}
                                            ref={(ref) => (inputRefs.current[index] = ref)}
                                            style={{ width: '50px', marginRight: '8px' }}
                                        />
                                    ))}

                                </div>
                            </div>
                        </div>)}

                        {!otpsent && (<div className="self-stretch flex flex-col items-start justify-between text-sm gap-[2vh] ">
                            <div className="w-full flex flex-col">
                                <button
                                    className="cursor-pointer [border:none] py-3 px-5 bg-[#228276] rounded-lg overflow-hidden flex flex-row items-center justify-center lg:self-start md:self-start lg:w-[unset] md:w-[unset] sm:w-full xs:w-full"
                                    to="/resetPassword"
                                    onClick={handleMobileVerification}
                                >
                                    <div className="relative text-sm font-semibold font-button text-white text-left">
                                        Send OTP
                                    </div>
                                </button>
                            </div>
                        </div>)}
                        {otpsent && (<div className="self-stretch flex flex-col items-start justify-between text-sm gap-[2vh] ">
                            <div className="w-full flex flex-col">
                                <button
                                    className="cursor-pointer [border:none] py-3 px-5 bg-[#228276] rounded-lg overflow-hidden flex flex-row items-center justify-center lg:self-start md:self-start lg:w-[unset] md:w-[unset] sm:w-full xs:w-full"
                                    to="/resetPassword"
                                    onClick={() => Login()}
                                >
                                    <div className="relative text-sm font-semibold font-button text-white text-left">
                                        Log In
                                    </div>
                                </button>
                            </div>
                        </div>)}
                        <div className="self-stretch flex flex-col items-start  justify-between text-sm gap-[2vh] ">
                            <div className="w-full flex flex-col">
                                <div class="lg:hidden md:hidden sm:flex xs:flex items-center mt-[10%] py-6 w-full">
                                    <div class="flex-grow h-px" style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}></div>

                                    <span class="text-[14px] text-[#333333] px-4 font-light">Or</span>

                                    <div class="flex-grow h-px" style={{ backgroundColor: "rgba(51, 51, 51, 0.25)" }}></div>
                                </div>
                                <div className="lg:hidden md:hidden sm:flex xs:flex flex-row justify-center space-x-2 h-13 self-stretch">
                                    <form className="w-1/3" action={`/auth/google`}>
                                        <button type="submit" className="my-0.5 w-full ">
                                            <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">
                                                <img src={Google} alt="google-login" className="cursor-pointer h-5 my-2" />
                                                <p className="text-[14px] font-semibold px-2 self-center">Google</p>
                                            </div>
                                        </button>
                                    </form>
                                    <form className="w-1/3" action={`/auth/linkedin`}>
                                        <button type="submit" className="my-0.5 w-full">
                                            <div className="flex px-2 py-1 border border-gray-300 rounded place-content-center">

                                                <img src={Linkedin} alt="linkedin-login" className="cursor-pointer h-5 my-2" />
                                                <p className="text-[14px] font-semibold px-2 self-center">Linkedin</p>
                                            </div>
                                        </button>
                                    </form>
                                </div>

                            </div>
                        </div>

                    </div>


                </div>
            </div>
        </div>
    )
}

export default OtpForm;