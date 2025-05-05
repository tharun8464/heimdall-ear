import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import swal from "sweetalert";
import { Link, useParams } from "react-router-dom";
import {
    resetPassword,
    sendResetPasswordMail,
    sendResetPasswordSMS,
    sendResetPasswordByUsername,
    validateSignupDetails,
} from "../../service/api";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {

    const [error, setError] = React.useState(null);
    const [Alert, setAlert] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [component, setComponent] = React.useState(0);
    const [disabled, setDisabled] = React.useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordVisiblee, setIsPasswordVisiblee] = useState(false);
    const [password, setPassword] = useState('');
    const [verifypassword, setVerifyPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [contact, setContact] = useState('');
    const [contactError, setContactError] = useState('');

    const { id } = useParams();

    const navigate = useNavigate();

    const handleNavigateBack = () => {
        navigate(-1);
    };

    React.useEffect(() => {
        if (id === undefined) {
            setComponent(1);
        } else {
            setComponent(2);
        }
    }, []);

    const handleInputText = (event, setStateFunction, setErrorFunction) => {
        setStateFunction(event.target.value);
        // Clear the error when the user starts typing
        setErrorFunction('');
    };

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

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const togglePasswordVisibilityy = () => {
        setIsPasswordVisiblee(!isPasswordVisiblee);
    };

    const resetPasswordHandle = async (values) => {
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
        setLoading(true);
        setAlert(null);
        try {
            let res = await resetPassword({
                reset_id: id,
                password: password,
            });
            if (res && res.status === 200) {
                swal({
                    title: "Success",
                    text: "Password Reset Successfully",
                    icon: "success",
                    button: "Ok",
                })
                window.location.href = "/login";
            } else if (res.status === 204) {
                showError('New password cannot be the same as the old one');
            }
            else {
                setAlert({ message: "Error reseting password !", success: false });
            }
        } catch (error) {
            setAlert({ success: false, message: "Error reseting password !" });
        }
        setLoading(false);
    };


    const submitHandle = async (values) => {
        if (contact === "" || contact === null) {
            setContactError('Email is required');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(contact)) {
            showError('enter a vaild email');

            return;
        }
        setLoading(true);
        setAlert(null);
        let check = await validateSignupDetails({ contact: contact, username: contact, email: contact });
        check = check?.data;
        if (!check?.username && !check?.email && !check?.contact) {
            showError('User Not Found');
            setAlert({
                success: false,
                message: "User Not Found",
            });
            setLoading(false);
            return;
        }
        try {
            if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contact)) {
                const datavalue = { contact: contact }
                let res = await sendResetPasswordMail(datavalue);

                if (res && res.status === 200) {
                    showToast('Reset password link sent to your mail');
                    setAlert({
                        success: true,
                        message: "A Mail has been sent to reset your password !",
                    });
                } else {
                    showError('Error sending mail');
                    setAlert({
                        success: false,
                        message: res.data.Error,
                    });
                }
            } else if (
                /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                    contact
                )
            ) {
                let res = await sendResetPasswordSMS(contact);
                if (res && res.status === 200) {
                    showToast('Reset password link sent to your mail');
                    setAlert({
                        success: true,
                        message: "A Mail has been sent to reset your password !",
                    });
                } else {
                    showError('Error sending OTP');
                    setAlert({
                        success: false,
                        message: res.data.Error,
                    });
                }
            } else {

                let res = await sendResetPasswordByUsername(contact);
                if (res && res.status === 200) {
                    swal({
                        title: "Success",
                        text: "Reset Password Link Sent To Your Mail",
                        icon: "success",
                        button: "Ok",
                    })
                    setAlert({
                        success: true,
                        message: "An Email has sent to reset your password !",
                    });
                } else {
                    showError('Error sending mail');
                    setAlert({
                        success: false,
                        message: res.data.Error,
                    });
                }
            }
            setLoading(false);
            setDisabled(true);
            setTimeout(() => {
                setDisabled(false);
            }, 30000);
        } catch (error) {
            setLoading(false);
            setAlert({ message: "Error Sending reset link", success: false });
        }
    };

    return (
        <div className="absolute lg:w-[37.08%] md:w-[60%] sm:w-[90%] xs:w-[90%] lg:left-[50.63%] md:left-[20%] sm:left-[5%] sm:right-[5%] xs:left-[5%] xs:right-[5%] flex flex-col items-start justify-between h-full text-5xl">
            <div className="w-full mt-auto mb-auto flex flex-col lg:h-[45%] md:h-[45%] sm:h-[90%] xs:h-[90%] justify-between">
                {component === 1 && (<div className="flex flex-col lg:justify-between md:justify-between sm:justify-start xs:justify-start  gap-[10px] h-full">
                    <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
                        <button
                            className="cursor-pointer [border:none] p-0 bg-[transparent] relative w-[71px] h-[17px] focus:outline-none lg:self-start md:self-center sm:self-start xs:self-start"
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
                            Forgot Password?
                        </div>
                        <div className="lg:hidden md:hidden sm:block xs:block lg:self-stretch md:self-center sm:self-center xs:self-center relative font-semibold sm:text-2xl xs:text-2xl">
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
                    <div>
                        <p className="lg:text-[14px] mx-auto md:text-[14px] sm:[12px] xs:text-[12px] leading-5 text-[#333333]  lg:text-left md:text-center sm:text-center xs:text-center">Enter the email address you used when you joined and we’ll send you instructions to reset your password. Biased for Action</p>
                    </div>
                    <div className="flex flex-col w-full justify-between">
                        <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-sm">
                            <div className="self-stretch flex flex-row items-center justify-start">
                                <h5 className="m-0 flex-1 relative text-[inherit] font-semibold font-inherit">
                                    Enter Your Email Address
                                </h5>
                            </div>
                            <input
                                className="font-button text-sm bg-whitesmoke-200 self-stretch rounded-lg overflow-hidden flex flex-col py-3 px-4 items-start justify-start border-[2px] border-solid border-[#E3E3E3]"
                                type="text"
                                placeholder={contactError ? `${contactError}` : 'Email'}
                                value={contact}
                                onChange={(event) => handleInputText(event, setContact, setContactError)}
                            />
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col items-start justify-between text-sm gap-[2vh] ">
                        <div className="w-full flex flex-col">
                            <button
                                className="cursor-pointer [border:none] py-3 px-5 bg-[#228276] rounded-lg overflow-hidden flex flex-row items-center justify-center lg:self-start md:self-center lg:w-[unset] md:w-[unset] sm:w-full xs:w-full"
                                to="/resetPassword"
                                onClick={() => submitHandle()}
                            >
                                <div className="relative text-sm font-semibold font-button text-white text-left">
                                    Send Reset Instructions
                                </div>
                            </button>
                        </div>
                    </div>
                </div>)}
                {component === 2 && (
                    <div className="flex flex-col justify-between lg:mt-[unset] md:mt-[unset] sm:mt-[20%] xs:mt-[20%] gap-[20px]">
                        <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">

                            <div className="md:block lg:block sm:hidden xs:hidden lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold md:text-2xl">
                                Set New Password
                            </div>
                            <div className="lg:hidden md:hidden sm:block xs:block lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold sm:text-2xl xs:text-2xl">
                                Set New Password
                            </div>
                            <h5 className="m-0 lg:self-stretch md:self-center  sm:self-center xs:self-center relative text-sm font-medium font-inherit">
                                Enter your new password below
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
                                            placeholder="6+ characters"
                                            value={password}
                                            onChange={(event) => handleInputText(event, setPassword, setPasswordError)}
                                        />
                                        <span
                                            className="visibility-icon"
                                            onClick={togglePasswordVisibility}
                                            style={{ position: 'relative', left: '95%', top: '-50%', transform: 'translateY(-50%)', zIndex: 10 }}
                                        >
                                            {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                                        </span>
                                    </div>




                                </div>
                            </div>
                            <div className="flex flex-col w-full justify-between">
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

                        </div>
                        <div className="self-stretch flex flex-col items-start justify-between text-sm gap-[2vh] ">
                            <div className="w-full flex flex-col">
                                <button
                                    className="cursor-pointer [border:none] py-3 px-5 bg-[#228276] rounded-lg overflow-hidden flex flex-row items-center justify-center lg:self-start md:self-center lg:w-[unset] md:w-[unset] sm:w-full xs:w-full"
                                    to="/resetPassword"
                                    onClick={() => resetPasswordHandle()}
                                >
                                    <div className="relative text-sm font-semibold font-button text-white text-left">
                                        Reset Password
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPasswordForm;