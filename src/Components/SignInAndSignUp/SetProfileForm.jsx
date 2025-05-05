import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    OTPMail,
    OTPSms,
    validateSignupDetails,
    url,
    countryCodeList,
    findCompanyById,
    setProfile,
    verifyOTPMail,
    getUserInviteFromResetPassId,
    getConfigDetails,
} from '../../service/api';
import { sendSMSOTP, verifySMSOTP1 } from "../../service/otpService";
import swal from "sweetalert";
import { ToastContainer, toast } from 'react-toastify';
import { IoIosArrowBack } from "react-icons/io";
import { setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from '../../service/storageService';
import { getCountryCode } from '../../service/api';
import styles from "../../../src/Pages/UserDashboard/UserProfileComponents/ContactDetailsPopup.module.css"
import CustomInput from '../CustomInput/CustomInput';

function SetProfileForm() {
    let [seconds, setSeconds] = useState(120);
    const [isRunning, setIsRunning] = useState(false);
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    //const [countryCode, setcountryCode] = useState('+91');
    const [countryCode, setCountryCode] = useState('+91');
    const [countryCodeValue, setCountryCodeValue] = useState([])  //take countrycode from this state
    const [contactValue, setContactValue] = useState("")           //take contact from this state  

    const [emailError, setEmailError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [otpp, setOtpp] = useState('');
    const [codex, setCodex] = useState('');
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [emailVerified, setEmailverified] = useState(false);
    const [mobileVerified, setMobileverified] = useState(false);
    const [verifyMobile, setVerifyMobile] = useState(false);
    const [OTP, setOTP] = React.useState(null);
    const [EmailOTP, setEmailOTP] = React.useState(null);
    const [EmailOTPError, setEmailOTPError] = React.useState(false);
    const [emailLoading, setEmailLoading] = React.useState(false);
    const [contactLoading, setContactLoading] = React.useState(false);
    const [verifySms, setverifySms] = React.useState(false);
    const [SmsOTP, setSMSOTP] = React.useState(null);
    const [SmsOTPError, setSmsOTPError] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState(null);
    const [userContact, setUserContact] = React.useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordVisiblee, setIsPasswordVisiblee] = useState(false);
    const [password, setPassword] = useState('');
    const [verifypassword, setVerifyPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [userIds, setUserIds] = useState(); //will store userId from the db 
    const supportInternationalOtp = JSON.parse(getSessionStorage("configurations"))?.supportInternationalOtp;
    useEffect(() => {
        const initial = async () => {
            await getConfigDetails();
            const res = await getCountryCode();
            if (res) {
                setCountryCodeValue(res?.data?.countryCode);
            }
        }
        initial();
    }, []);



    const handleNavigateBack = () => {
        navigate(-1);
    };

    React.useEffect(() => {
        const initial = async () => {
            let res = await getUserInviteFromResetPassId({ reset_id: id });
            setUserEmail(res.data.email);
            setUserContact(res.data.contact);
            setUserIds(res.data.userId);            //here we get the userId

            if (res && res.data.user_invite === 0) {
                try {
                    navigate(-1);
                } catch (err) {
                    window.location.href = "/login";
                }
            }
        };
        initial();
    }, []);

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

    const handleEmailVerification = async () => {
        setEmail(userEmail);
        // Call the sendEmailOTP API
        if (!email) {
            setEmailError('Email is required');
            return;
        }
        if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {
            showError('Enter a valid email id');
            return;
        }
        // console.log(email)
        setEmailError('');
        await sendEmailOTP({ email });
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

    const handleMobileVerification = async () => {
        setContact(userContact);
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
        // console.log(contact, countryCode)
        setMobileError('');
        await sendSmsOTP({ contact, countryCode });
    };

    const handleSubmitOTP = async () => {
        // Call the verifyEmailOTP API
        await verifyEmailOTP({ EmailOTP, email, otpp });
    };

    const handleSubmitCode = async () => {
        // Call the verifyEmailOTP API
        await verifySmsOTP({ SmsOTP: codex, contact });
    };

    const sendEmailOTP = async (values) => {
        setEmailLoading(true);


        let res2 = await OTPMail({ mail: values.email });

        if (res2) {
            setEmailOTP(res2);
            setEmailLoading(false);
            setVerifyEmail(true);
            showToast('Otp has been sent');
        } else if (!res2) {
            setEmailLoading(false);
            showError('Otp not sent');
        }
    };

    const verifyEmailOTP = async (values) => {

        if (values && values?.email && values?.EmailOTP) {

            let verifyEmailOtpRes = await verifyOTPMail(EmailOTP?.otpId, values?.otpp)
            if (verifyEmailOtpRes?.data?.success === true) {
                setEmailOTPError(false);
                setEmailverified(true);
            }
            else {
                showError('Invalid Email OTP, enter a valid one and retry');
            }
        }
        if (verifyEmail && verifySms) {
            setOTP(true);
        }
    }

    const handleChange1 = e => {
        setCountryCode(e.target.value)
        const { name, value } = e.target;

    };
    const handleChange = e => {
        setContactValue(e.target.value)
        const { name, value } = e.target;

    };

    const sendSmsOTP = async (values) => {
        setContactLoading(true);
        setIsRunning(true);
        setSeconds(120);


        setverifySms(false);

        // right now just send country code India. This will be updated once we have more countries
        // let countryCode;
        // if (values?.countryCode || values.countryCode?.trim() === '') {
        //     countryCode = "+91";
        // } else {
        //     countryCode = values?.countryCode;
        // }


        let respSMSOTP = await sendSMSOTP(values?.contact, values?.countryCode);
        if (respSMSOTP) {
            if (respSMSOTP?.status === 201) {
                swal({
                    title: "Contact verification",
                    text: respSMSOTP?.data?.details,
                    icon: "error",
                    button: false,
                });
            } else if (respSMSOTP?.status === 200) {
                showToast('Otp has been sent');
                setVerifyMobile(true)
                setSMSOTP(respSMSOTP);
            }
        } else {
            showError('Something went wrong please check the Contact number');
            setverifySms(false);
            setIsRunning(false);

        }
        setContactLoading(false);
    };

    const verifySmsOTP = async (values) => {
        if (values && values?.SmsOTP && values?.contact) {
            const data = {
                otpId: SmsOTP?.data?.otpId,
                reference: SmsOTP?.data?.otpId?.reference,
                contact: values?.contact,
                otp: values?.SmsOTP
            };
            // let verifyOTPResp = await verifySMSOTP(SmsOTP?.data?.otpId, values?.SmsOTP)
            let verifyOTPResp = await verifySMSOTP1(data);
            if (verifyOTPResp) {
                setSmsOTPError(false);
                setMobileverified(true);
                setverifySms(true);
            } else {
                showError('Invalid OTP, Please enter a valid one and retry');
            }
        }
    };

    const resetPasswordHandle = async (values) => {
        setLoading(true);
        if (!contact) {
            showError('Contact no is required!');
            return;
        }

        if (contact.length > 11 || contact.length <= 6) {
            showError('Contact should be between 7 to 11 digits!');
            return;
        }

        if (
            !/^\d+$/.test(contact)
        ) {

            showError('Enter a valid Contact no!');
            return;
        }
        //console.log(contact, countryCode)
        //setMobileError('');
        if (/\s/.test(password)) {
            showError('Password should not contain spaces!');
            return;
        }

        if (password.length < 8) {
            showError('Password should have at least 12 characters!');
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
            showError("Passwords don't match");
            setLoading(false);
            return;
        }

        //if (!emailVerified || !mobileVerified) {
        if (!emailVerified) {
            showError('Please verify your email');
            // showError('Please verify your email and contact');
            setLoading(false);
            return;
        }
        // validate the signup details
        try {


            let res = await setProfile({
                reset_pass_id: id,
                password: password,
                countryCode: countryCode,
                contact: contact,
            });

            if (res && res?.data?.success === false) {
                showError('Contact is already registered!');
                return;
            }
            setStorage("access_token", res?.data?.access_token);
            setStorage("refresh_token", res?.data?.refresh_token);
            // setSessionStorage("vm_version", '0.1');
            // setStorage("user_type", res?.data?.user?.user_type)
            // setStorage("user", JSON.stringify(res?.data?.user));

            setSessionStorage("user", JSON.stringify(res?.data?.user));
            setSessionStorage("vm_version", '0.1');
            setSessionStorage("user_type", res?.data?.user?.user_type)
            if (res && res.status === 200) {
                navigate(`/user?a=" + ${res?.data?.access_token}`);

            } else {

                showError('Error reseting password !');
            }
        } catch (error) {
            showError('Otp has been sent');
        }
        setLoading(false);
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

    return (
        <div className="absolute lg:w-[37.08%] md:w-[60%] sm:w-[90%] xs:w-[90%] lg:left-[50.63%] md:left-[20%] sm:left-[5%] sm:right-[5%] xs:left-[5%] xs:right-[5%] flex flex-col items-start justify-between h-full text-5xl">
            <div className="w-full mt-[5%] mb-auto flex flex-col lg:h-[53%] md:h-[53%] sm:h-[90%] xs:h-[90%] lg:gap-[40px] md:gap-[40px] sm:gap-[40px] xs:gap-[40px] justify-between">
                <div className="flex flex-col justify-between lg:mt-[unset] md:mt-[unset] sm:mt-[10%] xs:mt-[20%] gap-[20px]">
                    <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">

                        <div className="md:block lg:block sm:hidden xs:hidden lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold md:text-2xl">
                            Set Profile for ValueMatrix
                        </div>
                        <div className="lg:hidden md:hidden sm:block xs:block lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold sm:text-2xl xs:text-2xl">
                            Set Profile
                        </div>
                        <h5 className="m-0 lg:self-stretch md:self-center  sm:self-center xs:self-center relative text-sm font-medium font-inherit">
                            Fill in the below
                        </h5>
                    </div>
                    <div className="flex flex-col h-full justify-between ">
                        <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-sm">
                            <div className="self-stretch flex flex-row items-center justify-start">
                                <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                                    Email
                                </h5>
                                {verifyEmail === false ? (
                                    <div className="cursor-pointer [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"
                                        onClick={handleEmailVerification}
                                    >
                                        Verify
                                    </div>
                                ) : (
                                    null
                                )}

                                {verifyEmail && emailVerified ? (
                                    <div className=" [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"

                                    >
                                        Verified
                                    </div>
                                ) : (
                                    null
                                )}

                                {verifyEmail && !emailVerified ? (
                                    <div className="cursor-pointer [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"
                                        onClick={handleEmailVerification}
                                    >
                                        Resend
                                    </div>
                                ) : (
                                    null
                                )}

                            </div>
                            <div className="self-stretch flex lg:flex-row md:flex-row sm:flex-col xs:flex-col gap-4 width-[100%]">
                                <input
                                    className={`${verifyEmail && !emailVerified ? "lg:w-[55%] md:w-[55%]" : "lg:w-full md:w-full"} sm:w-full xs:w-full font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3]`}
                                    placeholder={emailError ? `${emailError}` : 'email'}
                                    type="text"
                                    value={userEmail}

                                    onChange={(event) => handleInputText(event, setEmail, setEmailError)}
                                    disabled={true}
                                />
                                {verifyEmail && !emailVerified ? (
                                    <div className="lg:w-[45%] md:w-[45%] sm:w-full xs:w-full self-stretch rounded-lg flex flex-row gap-4">
                                        <input
                                            className="text-center lg:w-[40%] md:w-[40%] sm:w-[50%] xs:w-[50%] font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5 px-2 items-start justify-start border-[2px] border-solid border-[#E3E3E3]"
                                            placeholder="OTP"
                                            maxLength={6}
                                            value={otpp}
                                            onChange={(e) => setOtpp(e.target.value)}
                                        />
                                        <button
                                            className="lg:w-[60%] md:w-[60%] sm:w-[50%] xs:w-[50%] cursor-pointer [border:none] py-2.5 px-5 rounded-lg overflow-hidden flex flex-row items-center justify-center"
                                            style={{ backgroundColor: "rgba(34, 130, 118, 0.10)" }}
                                            to="/resetPassword"
                                            onClick={handleSubmitOTP}
                                        >
                                            <div className="relative text-sm font-semibold font-button text-[#228276] text-left">
                                                Submit
                                            </div>
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        {/* --------------------------- */}

                        {/* <div className={styles.InputWrapper}>                           
                            <div className="w-30" >                               
                                <label style={{ fontWeight: "500", fontSize: "14px" }}>
                                    Country*
                                </label>
                                <select
                                    id="countryCodeSelect"
                                    onChange={handleChange1}
                                    name="countryCode"
                                    // value={contactDetails.countryCode}
                                    className="border-[0.5px] rounded-lg  border-gray-400 md:w-3/4"
                                >
                                    {countryCode?.map((item) => (
                                        <option key={item?._id} value={item.code}>
                                            {item.iso}  {item.code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <CustomInput
                                labelClassName={styles.SubHeadingSetProfileForm}
                                label={"Phone*"}
                                showLabel
                                onChange={handleChange}
                                name="contact"
                                // value={contactDetails.contact}
                                // isErrorState={fieldErrors && fieldErrors?.contact ? true : false}
                                // errorMessage={fieldErrors?.contact}
                                placeholder={"Phone Number"}
                            />

                        </div> */}
                        {/* *********************** */}
                        <div className="self-stretch flex flex-col items-start justify-start gap-[10px] mt-[20px] text-sm">
                            <div className="self-stretch flex flex-row items-center justify-start">
                                <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                                    Mobile
                                </h5>
                                {countryCode === "+91" && !supportInternationalOtp && verifyMobile === false ? (
                                    <div className="cursor-pointer [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"
                                        onClick={handleMobileVerification}
                                    >
                                        Verify
                                    </div>
                                ) : (
                                    null
                                )}
                                {supportInternationalOtp && verifyMobile === false ? (
                                    <div className="cursor-pointer [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"
                                        onClick={handleMobileVerification}
                                    >
                                        Verify
                                    </div>
                                ) : (
                                    null
                                )}
                                {verifyMobile && mobileVerified ? (
                                    <div className=" [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"

                                    >
                                        Verified
                                    </div>
                                ) : (
                                    null
                                )}

                                {verifyMobile && !mobileVerified ? (
                                    <div className="cursor-pointer [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"
                                        onClick={handleMobileVerification}
                                    >
                                        Resend
                                    </div>
                                ) : (
                                    null
                                )}
                            </div>
                            <div className="self-stretch flex lg:flex-row md:flex-row sm:flex-col xs:flex-col gap-4 width-[100%]">

                                <select
                                    id="countryCodeSelect"
                                    onChange={handleChange1}
                                    name="countryCode"
                                    value={countryCode}
                                    disabled={true}
                                    className="border-[0.5px] rounded-lg  border-gray-400 md:w-[30%] lg:w-[30%] sm:w-[30%] xs:w-[30%]"
                                >
                                    {countryCodeValue?.map((item) => (
                                        <option key={item?._id} value={item.code}>
                                            {item.iso}  {item.code}
                                        </option>
                                    ))}
                                </select>

                                {/* <div> */}
                                <input
                                    className={`${verifyMobile && !mobileVerified ? "lg:w-[55%] md:w-[55%]" : "lg:w-full md:w-full"} sm:w-full xs:w-full font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5 px-2 items-start justify-start border-[2px] border-solid border-[#E3E3E3]`}
                                    type="text"
                                    placeholder={mobileError ? `${mobileError}` : 'Phone Number'}
                                    maxLength
                                    minLength
                                    value={userContact}
                                    onChange={(event) => handleInputText(event, setContact, setMobileError)}
                                    disabled={true}
                                />
                                {/* </div> */}
                                {verifyMobile && !mobileVerified ? (
                                    <div className="lg:w-[45%] md:w-[45%] sm:w-full xs:w-full self-stretch rounded-lg flex flex-row gap-4">
                                        <input
                                            className="text-center lg:w-[40%] md:w-[40%] sm:w-[50%] xs:w-[50%] font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5  items-start justify-start border-[2px] border-solid border-[#E3E3E3]"
                                            placeholder="OTP"
                                            maxLength={6}
                                            value={codex}
                                            onChange={(e) => setCodex(e.target.value)}
                                        />
                                        <button
                                            className="lg:w-[60%] md:w-[60%] sm:w-[50%] xs:w-[50%] cursor-pointer [border:none] py-2.5 px-5 rounded-lg overflow-hidden flex flex-row items-center justify-center"
                                            style={{ backgroundColor: "rgba(34, 130, 118, 0.10)" }}
                                            to="/resetPassword"
                                            onClick={handleSubmitCode}
                                        >
                                            <div className="relative text-sm font-semibold font-button text-[#228276] text-left">
                                                Submit
                                            </div>
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        {/* ************************ */}
                        <div className="flex flex-col w-full justify-between mt-[20px]">
                            <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-sm">
                                <div className="self-stretch flex flex-row items-center justify-start">
                                    <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                                        Password
                                    </h5>
                                </div>

                                <div className="ralative w-full">
                                    <input
                                        className="font-button text-sm bg-whitesmoke-200 self-stretch w-full rounded-lg overflow-hidden flex flex-col py-2.5 px-2 items-start justify-start border-[2px] border-solid border-[#E3E3E3] relative"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        placeholder="6+ characters"
                                        value={password}
                                        onChange={(event) => handleInputText(event, setPassword, setPasswordError)}
                                    />

                                </div>




                            </div>
                        </div>
                        <div className="flex flex-col w-full justify-between mt-[20px]">
                            <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-sm">
                                <div className="self-stretch flex flex-row items-center justify-start">
                                    <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                                        Confirm Password
                                    </h5>
                                </div>




                                <div className="ralative w-full">
                                    <input
                                        className="font-button text-sm bg-whitesmoke-200 self-stretch w-full rounded-lg overflow-hidden flex flex-col py-2.5 px-2 items-start justify-start border-[2px] border-solid border-[#E3E3E3] relative"
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

                        <button
                            className="cursor-pointer [border:none] py-3 px-5 bg-[#228276] rounded-lg overflow-hidden flex flex-row items-center justify-center lg:self-start md:self-center lg:w-[unset] md:w-[unset] sm:w-full xs:w-full"
                            to="/resetPassword"
                            onClick={() => {
                                resetPasswordHandle();
                            }}
                        >
                            <div className="relative text-sm font-semibold font-button text-white text-left">
                                Set Profile
                            </div>
                        </button>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default SetProfileForm