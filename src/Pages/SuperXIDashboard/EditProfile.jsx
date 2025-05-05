import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ls from 'localstorage-slim';
import { getStorage, setStorage, getSessionStorage, setSessionStorage } from "../../service/storageService";
// Components And API services
import {
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
  validateSignupDetails,
} from "../../service/api";
import ReactCropper from "../../Pages/UserDashboard/ReactCrop.jsx";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import "react-image-crop/dist/ReactCrop.css";
import EditTabs from "../../Components/Dashbaord/EditTabs.jsx"

const EditProfile = () => {
  // Sets OTPs to NULL
  React.useEffect(() => {
    setEmailOTP(null);
    setContactOTP(null);
  }, []);

  // States for the Page
  const [user, setUser] = React.useState(null);
  const [access_token, setToken] = React.useState(null);

  // Updates Any Error during the Editing Profile
  const [Error, setError] = React.useState(null);

  // OTPs State
  const [EmailOTP, setEmailOTP] = React.useState(null);
  const [ContactOTP, setContactOTP] = React.useState(null);

  // Updates The Profile Picture
  const [ProfilePic, setProfilePic] = React.useState(undefined);

  const ModalBtnRef = React.useRef(null);
  const ModalRef = React.useRef(null);

  const [upImg, setUpImg] = React.useState(null);

  // Form Edit Submission
  const submit = async (values) => {
    let wait = 0;
    //console.log("values");
    if (EmailOTP === null && ContactOTP === null)
      wait = await SendOTPFunction(values);
    if (wait) return;
    if (EmailOTP && ContactOTP) {
      if (values.emailOTP !== EmailOTP && values.contactOTP !== ContactOTP) {
        setError("Invalid Email OTP and Contact OTP");
        return;
      }
    }
    if (EmailOTP && values.emailOTP !== EmailOTP) {
      setError("Invalid Email OTP");
      return;
    }
    if (ContactOTP && values.contactOTP !== ContactOTP) {
      setError("Invalid Contact OTP");
      return;
    }

    update(values);
  };

  const SendOTPFunction = async (values) => {
    let wait = 0;
    if (values.email !== user.email) {
      let emailValidate = await validateSignupDetails({ email: values.email });
      if (emailValidate.data.email === true) {
        setError("Email Already Registered");
        return 1;
      }
      let res = await updateEmailOTP(
        { mail: values.email },
        { access_token: access_token }
      );
      if (res.otp) {
        setEmailOTP(res.otp);
        wait = 1;
      } else if (res.Error) {
        setError(res.Error);
      }
    }
    if (values.contact !== user.contact) {
      let contactValidate = await validateSignupDetails({ contact: values.contact });
      if (contactValidate.data.contact === true) {
        setError("Contact Already Registered");
        return 1;
      }
      let res2 = await updateContactOTP(
        { contact: values.contact },
        { access_token: access_token }
      );
      if (res2.otp) {
        setContactOTP(res2.otp);
        wait = 1;
      } else if (res2.Error) {
        setError(res2.Error);
      }
    }
    return wait;
  };

  const update = async (values) => {
    let data = {
      firstName: values.firstName,
      lastname: values.lastName,
      about: values.about
    };
    if (EmailOTP) {
      data.email = values.email;
    }
    if (ContactOTP) {
      data.contact = values.contact;
    }
    //console.log(user, data);
    let res = await updateUserDetails(
      { user_id: user._id, updates: data },
      { access_token: access_token }
    );
    if (res.data.user) {
      //setStorage("user", JSON.stringify(res.data.user));
      setSessionStorage("user", JSON.stringify(res?.data?.user));

    }
    if (res.data.Error) {
      if (res.data.contact) {
        setError(res.data.Error);
        return;
      }
      if (res.data.email) {
        setError(res.data.Error);
        return;
      }
    } else if (res) {
      window.location.href = "/user/profile";
    } else {
      //console.log("Error");
    }
  };

  // Sets User And Access_token
  React.useEffect(() => {
    const getData = async () => {
      let access_token1 = await getStorage("access_token");
      let user = await JSON.parse(getSessionStorage("user"));
      await setUser(user);
      await setToken(access_token1);
      if (access_token1 === "null")
        setStorage("access_token", user.access_token);
      if (user && user.profileImg) {
        const imageData = await getSessionStorage("profileImg");
        if (imageData != undefined && imageData != '' && imageData != null) {
          let image = JSON.parse(imageData);
          let base64string = btoa(
            String.fromCharCode(...new Uint8Array(image?.data))
          );
          let src = `data:image/png;base64,${base64string}`;

          await setProfilePic(src);
        }
      }
    };
    getData();
  }, []);

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Edit Profile</p>
      {user !== null && (
        <div className="m-5">
          <div className="h-48 w-full relative" style={{ background: "#99DEFF" }}>

          </div>
          <div className="relative mx-5 rounded-md w-full p-3 flex items-center ">
            <div className="absolute -top-20 left-20">

              <img
                src={
                  user && user.profileImg && ProfilePic ? ProfilePic : Avatar
                }
                className="h-40 w-40 rounded-full mx-6"
                alt="userAvatar"
              />
            </div>
            <div className="ml-72">
              <p className="font-semibold text-3xl">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-400 text-lg">{user.username}</p>
            </div>
            <div className="ml-auto mr-5">
              <label>
                <button
                  className="bg-blue-500 rounded-sm text-white px-2 py-1 cursor-pointer"
                  onClick={() => ModalBtnRef.current.click()}
                >
                  Upload Image
                </button>
              </label>
            </div>
          </div>

          <div className="my-3 shadow-md rounded-md w-full p-6 md:pt-6 pt-3">


            <EditTabs />
          </div>
        </div>
      )}

      {/* Modal For Cropping Image */}
      <button
        type="button"
        className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out hidden"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        ref={ModalBtnRef}
      >
        Launch static backdrop modal
      </button>
      <div
        className="modal fade fixed ml-[25vw] top-0  hidden h-full outline-none overflow-x-hidden overflow-y-auto"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog relative w-[40vw] pointer-events-none my-5">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalLabel"
              >
                Update Profile Image
              </h5>
            </div>
            <div className="modal-body relative p-4">
              <ReactCropper Modal={ModalRef} />
            </div>
          </div>
          <button
            type="button"
            className="hideen px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
            data-bs-dismiss="modal"
            ref={ModalRef}
          >
            Close
          </button>
        </div>
      </div>
      {/* Modal For Cropping Image */}
    </div>
  );
};

export default EditProfile;
