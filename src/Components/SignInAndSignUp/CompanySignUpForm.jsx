import React, { useRef, useEffect, Fragment, useState } from "react";
import swal from "sweetalert";
import {
    authenticateSignUp,
    OTPMail,
    OTPSms,
    validateSignupDetails,
    url,
    countryCodeList,
    findCompanyById,
    verifyOTPMail,
    getConfigDetails,
} from "../../service/api";
import wildcards from "disposable-email-domains/wildcard.json";
import { useNavigate } from 'react-router-dom';
import Message from "./MessagePop/Message";
import './MessagePop/Message.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendSMSOTP, verifySMSOTP1 } from "../../service/otpService";
import { getCountryCode } from "../../service/api";
import { getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
// Assets
import { IoIosArrowBack } from "react-icons/io";



const validateUserEmail = (value) => {
    let domain = value.split("@")[1];
    let host = domain.split(".")[0];
    if (wildcards.includes(host) | wildcards.includes(domain)) {
        return false;
    }
    return true;
};

const validateCompanyEmail = (value) => {
    let domain = value?.split("@")[1];
    let host = domain?.split(".")[0];
    let domains = ["gmail", "yahoo", "bing"];
    if (domains.includes(host)) {
        return false;
    }
    return true;
};

const CompanySignUpForm = () => {
    let [seconds, setSeconds] = useState(120);
    const [isRunning, setIsRunning] = useState(false);

    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    // const [countryCode, setCountrycode] = useState('+91');
    const [emailError, setEmailError] = useState(false);
    const [mobileError, setMobileError] = useState(false);
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
    const [signupError, setSignupError] = React.useState(null);
    const [SmsOTP, setSMSOTP] = React.useState(null);
    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [companyNameError, setCompanyNameError] = useState(false);
    const [companyId, setCompanyId] = useState('');
    const [varifiedCompanyId, setVarifiedCompanyId] = useState(false);
    const [companyIdError, setCompanyIdError] = useState(false);
    const [countryCodeValue, setCountryCodeValue] = useState([])
    const [countryCode, setCountryCode] = useState('+91');
    const supportInternationalOtp = JSON.parse(getSessionStorage("configurations"))?.supportInternationalOtp;
    const handleNavigateBack = () => {
        navigate(-1);
    };

    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [emailParam]);

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

    const handleChange1 = e => {
        setCountryCode(e.target.value);
    };
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


    const handleInputChange = (event, setStateFunction, setErrorFunction) => {
        setStateFunction(event.target.value);
        // Clear the error when the user starts typing
        setErrorFunction('');
    };


    const handleFormSubmit = () => {
        let hasErrors = false;

        if (firstName.trim() === '') {
            setFirstNameError(true);
            showError('First name is required');
            hasErrors = true;
        } else if (firstName.length > 20) {
            showError('First Name must be 20 characters or less');
            hasErrors = true;
            setFirstNameError(true);
        } else if (!/^[a-zA-Z ]+$/.test(firstName)) {
            showError('Only ALphabets and Spaces are allowed for first name');
            hasErrors = true;
            setFirstNameError(true);
        } else {
            setFirstNameError(false);
        }

        if (lastName.trim() === '') {
            showError('Last name is required');
            hasErrors = true;
            setLastNameError(true);
        } else if (lastName.length > 20) {
            showError('Last Name must be 20 characters or less');
            hasErrors = true;
            setLastNameError(true);
        } else if (!/^[a-zA-Z ]+$/.test(lastName)) {
            showError('Only ALphabets and Spaces are allowed for last name');
            hasErrors = true;
            setLastNameError(true);
        } else {
            setLastNameError(false);
        }

        if (companyName.trim() === '') {
            showError('Comapny name is required');
            hasErrors = true;
            setCompanyNameError(true);
        } else {
            setCompanyNameError(false);
        }

        if (!varifiedCompanyId) {
            showError('Verify Company ID');
            hasErrors = true;
            setCompanyIdError(true);
        } else {
            setCompanyIdError(false);
        }


        if (!emailVerified) {
            showError('Verify your email');
            setEmailError(true);
        }

        if (countryCode === '+91' && !supportInternationalOtp && !mobileVerified) {
            showError('Verify your mobile no');
            hasErrors = true;
            setMobileError(true);
        } else {
            setMobileError(false);
        }

        if (supportInternationalOtp && !mobileVerified) {
            showError('Verify your mobile no');
            hasErrors = true;
            setMobileError(true);
        } else {
            setMobileError(false);
        }




        // If there are errors, prevent form submission
        if (hasErrors) {
            return;
        }

        // If all fields are valid, navigate to the next page
        navigate('/register/createPassword', { state: { firstName, companyName, companyId, countryCode, email, contact, lastName, signStatus: 'Company' } });
    };




    const sendEmailOTP = async (values) => {
        setEmailLoading(true);

        //console.log("working", values.email)
        if (validateCompanyEmail(values.email) === false) {
            swal({
                title: "Sign Up",
                text: "Enter Company Email !",
                icon: "error",
                button: false,
            });
            return;
        }
        setSignupError(null);
        //console.log("values", values)
        let check = await validateSignupDetails(values);
        //console.log(check.data);

        if (check.data.username && check.data.email === true) {
            setSignupError("Username and Email Already Registered");

            showError('Username and Email Already Registered');

        }

        if (check.data.email) {

            showError('Email Already Registered');
        }

        if (check.data.username) {

            showError('Username Already Registered');
        }
        if (check.data.username || check.data.email) {
            setEmailLoading(false);

            return;
        }

        let res2 = await OTPMail({ mail: values.email });

        if (res2) {
            setEmailOTP(res2);
            setEmailLoading(false);
            setVerifyEmail(true);
            showToast('Otp has been sent');
        } else if (!res2) {
        }
    };

    const verifyEmailOTP = async (values) => {

        if (values && values?.email && values?.EmailOTP) {
            //console.log("mailtu", EmailOTP, values.otpp)
            let verifyEmailOtpRes = await verifyOTPMail(EmailOTP?.otpId, values?.otpp)
            if (verifyEmailOtpRes?.data?.success === true) {
                setEmailOTPError(false);
                setEmailverified(true);
            }
            else {

                showError('Invalid Email OTP. Please enter a valid one and retry');
            }
        }
        if (verifyEmail && verifySms) {
            setOTP(true);
        }
    }

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

    const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
        seconds % 60
    ).padStart(2, '0')}`;


    const varifyCompany = async () => {

        let hasErrors = false;


        if (firstName.trim() === '') {
            showError('First name is required');
            hasErrors = true;
            setFirstNameError(true);
        } else if (firstName.length > 20) {
            showError('First Name must be 20 characters or less');
            hasErrors = true;
            setFirstNameError(true);
        } else if (!/^[a-zA-Z ]+$/.test(firstName)) {
            showError('Alphabetic Characters are required for First name');
            hasErrors = true;
            setFirstNameError(true);
        }
        else {
            setFirstNameError(false);
        }

        if (lastName.trim() === '') {
            showError('Last name is required');
            hasErrors = true;
            setLastNameError(true);
        } else if (lastName.length > 20) {
            showError('Last Name must be 20 characters or less');
            hasErrors = true;
            setLastNameError(true);
        } else if (!/^[a-zA-Z ]+$/.test(lastName)) {
            showError('Alphabetic Characters are required for Last name');
            hasErrors = true;
            setLastNameError(true);
        }
        else {
            setLastNameError(false);
        }

        if (companyName.trim() === '') {
            showError('Company name is required');
            hasErrors = true;
            setCompanyNameError(true);
        } else {
            setCompanyNameError(false);
        }

        //console.log(companyId)
        if (!companyId) {
            showError('Enter a Company Id');
            hasErrors = true;
            setCompanyIdError(true);
        } else if (companyId.length < 24) {
            showError('Enter a valid Company Id');
            hasErrors = true;
            setCompanyIdError(true);
        }
        if (hasErrors) {
            return;
        }
        let res = await findCompanyById({ companyId });

        if (res.data.status == 200) {

            swal({
                title: "Comapny ID Verified",
                text: "Company ID Verified successfully",
                icon: "success",
                button: "Continue",
            }).then(() => {
                setVarifiedCompanyId(true);
            });
        } else {


            showError('Invalid Company ID');
        }

    };



    const sendSmsOTP = async (values) => {
        setContactLoading(true);
        setIsRunning(true);
        setSeconds(120);
        if (validateCompanyEmail(values.email) === false) {
            swal({
                title: "Sign Up",
                text: "Enter Company Email !",
                icon: "error",
                button: false,
            });
            return;
        }
        setSignupError(null);
        setverifySms(false);
        //console.log("name", values)
        let check = await validateSignupDetails(values);
        //console.log(check?.data)
        if (check.data.username && check.data.contact) {
            swal({
                title: "Sign Up",
                text: "Username or contact or both already in use",
                icon: "error",
                button: false,
            });
        }

        if (check.data.contact) {
            showError('Contact already in use');
            setverifySms(false);
            setIsRunning(false);

        }
        if (check.data.username) {
            swal({
                title: "Sign Up",
                text: "Username not available",
                icon: "error",
                button: false,
            });
        }

        if (check.data.username || check.data.contact) {
            setContactLoading(false);
            return;
        }
        // right now just send country code India. This will be updated once we have more countries
        let countryCode;
        if (values?.countryCode || values.countryCode?.trim() === '') {
            countryCode = "+91";
        } else {
            countryCode = values?.countryCode;
        }

        //console.log("mobile", values.contact, countryCode)
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

                setMobileverified(true);
                setverifySms(true);
            } else {
                showError('Invalid OTP. Please enter a valid one ');
            }
        }
    };



    const handleEmailVerification = async () => {
        // Call the sendEmailOTP API

        let hasErrors = false;



        if (firstName.trim() === '') {
            showError('First name is required');
            hasErrors = true;
            setFirstNameError(true);
        } else if (firstName.length > 20) {
            showError('First Name must be 20 characters or less');
            hasErrors = true;
            setFirstNameError(true);
        } else if (!/^[a-zA-Z ]+$/.test(firstName)) {
            showError('Alphabetic Characters are required for First name');
            hasErrors = true;
            setFirstNameError(true);
        }
        else {
            setFirstNameError(false);
        }

        if (lastName.trim() === '') {
            showError('Last name is required');
            hasErrors = true;
            setLastNameError(true);
        } else if (lastName.length > 20) {
            showError('Last Name must be 20 characters or less');
            hasErrors = true;
            setLastNameError(true);
        } else if (!/^[a-zA-Z ]+$/.test(lastName)) {
            showError('Alphabetic Characters are required for Last name');
            hasErrors = true;
            setLastNameError(true);
        }
        else {
            setLastNameError(false);
        }

        if (companyName.trim() === '') {
            showError('Company name is required');
            hasErrors = true;
            setCompanyNameError(true);
        } else {
            setCompanyNameError(false);
        }

        if (!varifiedCompanyId) {
            showError("Verify the Company ID");
            setCompanyIdError(true);
            hasErrors = true;
        }

        if (!email) {
            showError('Email is required');
            setEmailError(true);
            hasErrors = true;
            return;
        }
        if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {
            showError('Enter a valid email');
            setEmailError(true);
            hasErrors = true;
        }
        if (hasErrors) {
            return;
        }
        //console.log(email)
        setEmailError('');
        await sendEmailOTP({ email });
    };

    const handleMobileVerification = async () => {
        // Call the sendEmailOTP API
        let hasErrors = false;



        if (firstName.trim() === '') {
            showError('First name is required');
            hasErrors = true;
            setFirstNameError(true);
        } else if (firstName.length > 20) {
            showError('First Name must be 20 characters or less');
            hasErrors = true;
            setFirstNameError(true);
        } else if (!/^[a-zA-Z ]+$/.test(firstName)) {
            showError('Alphabetic Characters are required for First name');
            hasErrors = true;
            setFirstNameError(true);
        }
        else {
            setFirstNameError(false);
        }

        if (lastName.trim() === '') {
            showError('Last name is required');
            hasErrors = true;
            setLastNameError(true);
        } else if (lastName.length > 20) {
            showError('Last Name must be 20 characters or less');
            hasErrors = true;
            setLastNameError(true);
        } else if (!/^[a-zA-Z ]+$/.test(lastName)) {
            showError('Alphabetic Characters are required for Last name');
            hasErrors = true;
            setLastNameError(true);
        }
        else {
            setLastNameError(false);
        }

        if (companyName.trim() === '') {
            showError('Company name is required');
            hasErrors = true;
            setCompanyNameError(true);
        } else {
            setCompanyNameError(false);
        }

        if (!varifiedCompanyId || !verifyEmail) {
            if (!varifiedCompanyId) {
                showError("Verify Company Id")
                setCompanyIdError(true);
            }
            if (!verifyEmail) {
                showError("Verify Email")
                setEmailError(true);
            }
        }
        if (!contact) {
            showError('Contact no is required');
            setMobileError(true);
            hasErrors = true;
        } else if (contact.length < 10) {
            hasErrors = true;
            setMobileError(true);
            showError('Enter a valid number');
        } else if (!/^\d+$/.test(contact)) {
            hasErrors = true;
            setMobileError(true);
            showError('Enter a valid Contact no"');
        } else {
            setMobileError(false);
        }

        if (hasErrors) {
            return;
        }
        //console.log(contact, countryCode)
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








    return (
        <div className="absolute lg:w-[37.08%] md:w-[60%] sm:w-[90%] xs:w-[90%] lg:left-[50.63%] md:left-[20%] sm:left-[5%] sm:right-[5%] xs:left-[5%] xs:right-[5%] flex flex-col items-start justify-between h-full text-5xl">
            <div className="w-full mt-[17%] flex flex-col  lg:gap-[40px] md:gap-[40px] sm:gap-[40px] xs:gap-[40px] justify-between">
                <div className="flex flex-col justify-between lg:mt-[unset] md:mt-[unset] sm:mt-[15%] xs:mt-[15%] gap-[20px]">
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
                        <div className="md:block lg:block sm:hidden xs:hidden lg:self-stretch  md:self-center sm:self-center xs:self-center relative font-semibold md:text-2xl">
                            Sign up to ValueMatrix
                        </div>
                        <div className="lg:hidden md:hidden sm:flex xs:flex lg:self-stretch md:self-center align-items-center   font-semibold sm:text-2xl xs:text-2xl">
                            <button
                                className="flex cursor-pointer mt-1 [border:none] p-0 bg-[transparent] relative w-[71px] h-[17px] focus:outline-none lg:self-start md:self-center sm:self-start xs:self-start"
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
                            <div className="ml-[60px]"> Sign up</div>


                        </div>
                        <h5 className="m-0 lg:self-stretch md:self-center  sm:self-center xs:self-center relative text-sm font-medium font-inherit">
                            Enter your information
                        </h5>

                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start gap-[30px] w-[100%] text-sm">
                        <div className="flex-1 flex flex-col items-start justify-start gap-[10px] w-[50%]">
                            <h5 className="w-full m-0 self-stretch relative text-[inherit] font-semibold font-inherit">
                                First name
                            </h5>
                            <input
                                className={`w-full font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] ${firstNameError ? 'border-red-400 border-[2px] border-solid' : 'border-[#E3E3E3]'} `}
                                type="text"
                                placeholder={firstName ? `${firstName}` : 'First name'}
                                value={firstName}
                                onChange={(event) => handleInputChange(event, setFirstName, setFirstNameError)}
                            />
                        </div>
                        <div className="flex-1 flex flex-col items-start justify-start gap-[10px] w-[50%]">
                            <h5 className="w-full m-0 self-stretch relative text-[inherit] font-semibold font-inherit">
                                Last name
                            </h5>
                            <input
                                className={`w-full font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] ${lastNameError ? 'border-red-400 border-[2px] border-solid' : 'border-[#E3E3E3]'}`}
                                type="text"
                                placeholder={lastName ? `${lastName}` : 'Last name'}
                                value={lastName}
                                onChange={(event) => handleInputChange(event, setLastName, setLastNameError)}
                            />
                        </div>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start gap-[30px] w-[100%] text-sm">
                        <div className="flex-1 flex flex-col items-start justify-start gap-[10px] w-[50%]">
                            <h5 className="w-full m-0 self-stretch relative text-[inherit] font-semibold font-inherit">
                                Company name
                            </h5>
                            <input
                                className={`w-full font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] ${companyNameError ? 'border-red-400 border-[2px] border-solid' : 'border-[#E3E3E3]'}`}
                                type="text"
                                placeholder={companyName ? `${companyName}` : 'Company name'}
                                value={companyName}
                                onChange={(event) => handleInputChange(event, setCompanyName, setCompanyNameError)}
                            />
                        </div>
                        <div className="flex-1 flex flex-col items-start justify-start gap-[10px] w-[50%]">

                            <div className="self-stretch flex flex-row items-center justify-start">
                                <h5 className="w-full m-0 self-stretch relative text-[inherit] font-semibold font-inherit">
                                    Company ID
                                </h5>
                                {varifiedCompanyId === false ? (
                                    <div className="cursor-pointer [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"
                                        onClick={() => varifyCompany()}
                                    >
                                        Verify
                                    </div>
                                ) : (
                                    null
                                )}

                                {varifiedCompanyId ? (
                                    <div className=" [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"

                                    >
                                        Verified
                                    </div>
                                ) : (
                                    null
                                )}



                            </div>
                            <input
                                className={`w-full font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] ${companyIdError ? 'border-red-400 border-[2px] border-solid' : 'border-[#E3E3E3]'}`}
                                type="text"
                                placeholder={companyId ? `${companyId}` : 'Company Id'}
                                value={companyId}
                                onChange={(event) => handleInputChange(event, setCompanyId, setCompanyIdError)}
                                disabled={varifiedCompanyId}
                            />
                        </div>
                    </div>
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
                                className={`${verifyEmail && !emailVerified ? "lg:w-[55%] md:w-[55%]" : "lg:w-full md:w-full"} sm:w-full xs:w-full font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] ${emailError ? 'border-red-400 border-[2px] border-solid' : 'border-[#E3E3E3]'} `}
                                placeholder={email ? `${email}` : 'Email'}
                                type="text"
                                value={email}

                                onChange={(event) => handleInputChange(event, setEmail, setEmailError)}
                                disabled={emailVerified}
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
                    <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-sm">
                        <div className="self-stretch flex flex-row items-center justify-start">
                            <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                                Mobile
                            </h5>
                            {countryCode === '+91' && !supportInternationalOtp && verifyMobile === false ? (
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

                            {verifyMobile && isRunning && !mobileVerified ? (
                                <div className="cursor-pointer [border:none] p-0 bg-[transparent] flex-1 relative text-sm font-medium font-button text-[#228276] text-right inline-block"

                                >
                                    <span style={{ border: '1px solid lightgreen', color: 'maroon', padding: '4px', }}> {formattedTime}</span>
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

                            {verifyMobile && !mobileVerified && !isRunning ? (
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
                                className="border-[0.5px] rounded-lg  border-gray-400 md:w-[25%] lg:w-[25%] sm:w-[25%] xs:w-[25%]"
                            >
                                {countryCodeValue?.map((item) => (
                                    <option key={item?._id} value={item.code}>
                                        {item.iso}  {item.code}
                                    </option>
                                ))}
                            </select>
                            <input
                                className={`${verifyMobile && !mobileVerified ? "lg:w-[55%] md:w-[55%]" : "lg:w-full md:w-full"} sm:w-full xs:w-full font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-2.5 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3] ${mobileError ? 'border-red-400 border-[2px] border-solid' : 'border-[#E3E3E3]'} `}
                                type="tel"
                                placeholder={contact ? `${contact}` : 'Phone Number'}
                                maxLength={10}
                                minLength
                                value={contact}
                                onChange={(event) => handleInputChange(event, setContact, setMobileError)}
                                onKeyDown={(event) => {
                                    // Allow only numeric characters and special keys like backspace, delete, arrow keys
                                    if (!/[0-9]/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
                                        event.preventDefault();
                                    }
                                }}

                                disabled={mobileVerified}
                            />
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
                </div>
                <div className="self-stretch flex flex-col items-start justify-between text-sm gap-[2vh] ">
                    <div className="w-full flex flex-col">
                        <button
                            className="cursor-pointer [border:none] py-2.5 px-5 bg-[#228276] rounded-lg overflow-hidden flex flex-row items-center justify-center lg:self-start md:self-center lg:w-[unset] md:w-[unset] sm:w-full xs:w-full"
                            onClick={handleFormSubmit}
                        >
                            <div className="relative text-sm font-semibold font-button text-white text-left">
                                Continue
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanySignUpForm;
