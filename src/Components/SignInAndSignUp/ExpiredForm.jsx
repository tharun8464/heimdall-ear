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

const ExpiredForm = () => {

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
            } else {
                setAlert({ message: "Error reseting password !", success: false });
            }
        } catch (error) {
            setAlert({ success: false, message: "Error reseting password !" });
        }
        setLoading(false);
    };




    return (
        <div className="absolute lg:w-[37.08%] md:w-[60%] sm:w-[90%] xs:w-[90%] lg:left-[50.63%] md:left-[20%] sm:left-[5%] sm:right-[5%] xs:left-[5%] xs:right-[5%] flex flex-col items-start justify-between h-full text-5xl">
            <div className="w-full mt-auto mb-auto flex flex-col lg:h-[45%] md:h-[45%] sm:h-[90%] xs:h-[90%] justify-between">
                <div className="flex flex-col lg:justify-between md:justify-between sm:justify-start xs:justify-start  gap-[10px] h-full">
                    <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">

                        <div className="md:block lg:block sm:hidden xs:hidden lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold md:text-2xl">
                            Ooops!!! Your Link Has Expired
                        </div>
                        <div className="lg:hidden md:hidden sm:block xs:block mt-[200px] lg:self-stretch md:self-center sm:self-center xs:self-center relative font-semibold sm:text-2xl xs:text-2xl">
                            Ooops!!! Your Link Has Expired
                        </div>
                        <div className="m-0 lg:self-stretch md:self-center  sm:self-center xs:self-center relative text-sm font-medium font-inherit">
                            <div className="lg:flex lg:justify-start md:flex md:justify-center sm:flex sm:justify-center xs:flex xs:justify-center lg:text-[14px] md:text-[14px] sm:[12px] xs:text-[12px] gap-2">

                                <span className="font-semibold font-button text-[#228276] cursor-pointer"
                                    onClick={() => navigate('/login')}
                                >
                                    Back to login
                                </span>
                                <span className="font-medium font-button text-dark-100">{` `}</span>
                            </div>
                        </div>
                    </div>



                </div>

            </div>
        </div>
    )
}

export default ExpiredForm;