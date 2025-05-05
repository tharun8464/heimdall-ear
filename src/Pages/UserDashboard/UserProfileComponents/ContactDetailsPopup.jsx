import Button from "../../../Components/Button/Button";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import useUser from "../../../Hooks/useUser";
import styles from "./ContactDetailsPopup.module.css";
import React, { useState } from "react";
import { getStorage, getSessionStorage } from "../../../service/storageService";
import { useEffect } from "react";
import usePopup from "../../../Hooks/usePopup";
import { useSelector } from "react-redux";
import { getCountryCode } from "../../../service/api";

const ContactDetailsPopup = ({ isMobile, setIsEditing }) => {
  const { handleUpdateUserDetails } = useUser();
  const [user, setUser] = useState(null);
  const [countryCode, setcountryCode] = useState([]);
  const [fieldErrors, setFieldErrors] = useState();
  const { handlePopupCenterOpen } = usePopup();
  const { userDetails } = useSelector(state => state.user);
  // console.log("userDetailsContact:", userDetails);
  //names are acc to the api
  const [contactDetails, setContactDetails] = useState({
    firstName: "",
    lastname: "",
    email: "",
    linkedinurl: "",
    countryCode: "",
    contact: "",
    location: "",
  });

  useEffect(() => {
    if (userDetails?.user) {
      setContactDetails({
        firstName: userDetails.user?.firstName,
        lastname: userDetails.user?.lastname,
        email: userDetails.user?.email,
        linkedinurl: userDetails.user?.linkedinurl,
        contact: userDetails.user?.contact,
        countryCode: userDetails.user?.countryCode,
        location: userDetails.user?.location,
      });
    }
  }, [userDetails]);

  useEffect(() => {
    const initial = async () => {
      const res = await getCountryCode();
      if (res) {
        setcountryCode(res.data.countryCode);
      }
    }
    initial();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setContactDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    let fieldErrors = {};

    const trimmedLinkedinUrl = contactDetails?.linkedinurl?.split("?")[0]
    contactDetails.linkedinurl = trimmedLinkedinUrl

    const nameRegex = /^[a-zA-Z ]+$/; // Updated Regex to allow spaces

    if (!contactDetails?.firstName || contactDetails?.firstName.trim() === "") {
      fieldErrors.firstName = "First name is required!";
    } else if (!nameRegex.test(contactDetails.firstName)) {
      fieldErrors.firstName = "First name should not contain special characters!";
    } else if (contactDetails.firstName.length > 25) {
      fieldErrors.firstName = "First name should not be longer than 25 characters!";
    }

    if (!contactDetails?.lastname || contactDetails?.lastname.trim() === "") {
      fieldErrors.lastname = "Last name is required!";
    } else if (!nameRegex.test(contactDetails.lastname)) {
      fieldErrors.lastname = "Last name should not contain special characters!";
    } else if (contactDetails.lastname.length > 25) {
      fieldErrors.lastname = "Last name should not be longer than 25 characters!";
    }

    if (!contactDetails?.email || contactDetails?.email.trim() === "") {
      fieldErrors.email = "Email is required!";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactDetails?.email)) {
        fieldErrors.email = "Please enter a valid email!";
      } else if (contactDetails.email.length > 50) {
        fieldErrors.email = "Email should not be longer than 50 characters!";
      }
    }

    if (!contactDetails?.linkedinurl || contactDetails?.linkedinurl.trim() === "") {
      fieldErrors.linkedinurl = "LinkedIn URL is required!";
    } else {
      const regex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+/;
      if (!regex.test(contactDetails?.linkedinurl)) {
        fieldErrors.linkedinurl = "Please enter a valid LinkedIn URL!";
      } else if (contactDetails.linkedinurl.length > 100) {
        fieldErrors.linkedinurl = "LinkedIn URL should not be longer than 100 characters!";
      }
    }

    if (!contactDetails?.contact || contactDetails?.contact.trim() === "") {
      fieldErrors.contact = "Contact is required!";
    } else {
      if (contactDetails?.contact.length > 11 || contactDetails?.contact.length <= 6) {
        fieldErrors.contact = "Phone should be between 7 to 11 digits!";
      }
      const phoneRegex = /^[0-9][0-9]+$/
      if (!phoneRegex.test(contactDetails?.contact)) {
        fieldErrors.contact = "Only numbers are allowed!";
      }
    }

    if (!contactDetails?.location || contactDetails?.location.trim() === "") {
      fieldErrors.location = "Location is required!";
    } else if (!nameRegex.test(contactDetails.location)) {
      fieldErrors.location = "Location should not contain special characters!";
    } else if (contactDetails.location.length > 50) {
      fieldErrors.location = "Location should not be longer than 50 characters!";
    }

    // Update the fieldErrors state
    setFieldErrors(fieldErrors);

    // Check if there are no errors and proceed
    if (Object.keys(fieldErrors).length === 0) {
      handleUpdateUserDetails({
        user_id: user?._id,
        updates: { data: contactDetails },
      });
      handlePopupCenterOpen(false);
      if (isMobile) {
        setIsEditing(false)
      }
    }
  };

  const handleCancel = () => {
    handlePopupCenterOpen(false);
    setContactDetails({
      firstName: userDetails.user?.firstName,
      lastname: userDetails.user?.lastname,
      email: userDetails.user?.email,
      linkedinurl: userDetails.user?.linkedinurl,
      contact: userDetails.user?.contact,
      countryCode: userDetails.user?.countryCode,
      location: userDetails.user?.location,
    });
    if (isMobile) {
      setIsEditing(false)
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      //let user = await getStorage("user");
      let user = getSessionStorage("user");
      user = JSON.parse(user);
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    isMobile ? <div className={`${styles.Wrapper}`}>
      <div>
        <h2 className={styles.Heading}>Contact Details</h2>
      </div>
      <CustomInput
        labelClassName={styles.SubHeading}
        label={"First Name*"}
        showLabel
        onChange={handleChange}
        name="firstName"
        value={contactDetails?.firstName}
        isErrorState={fieldErrors && fieldErrors?.firstName ? true : false}
        errorMessage={fieldErrors?.firstName}
      />
      <CustomInput
        labelClassName={styles.SubHeading}
        label={"Last Name*"}
        showLabel
        onChange={handleChange}
        name="lastname"
        value={contactDetails.lastname}
        isErrorState={fieldErrors && fieldErrors?.lastname ? true : false}
        errorMessage={fieldErrors?.lastname}
      />
      <CustomInput
        labelClassName={styles.SubHeading}
        label={"Email*"}
        showLabel
        onChange={handleChange}
        name="email"
        type="email"
        value={contactDetails.email}
        isErrorState={fieldErrors && fieldErrors?.email ? true : false}
        errorMessage={fieldErrors?.email}
      />
      <CustomInput
        labelClassName={styles.SubHeading}
        label={"Linkedin profile URL*"}
        showLabel
        onChange={handleChange}
        name="linkedinurl"
        value={contactDetails.linkedinurl}
        isErrorState={fieldErrors && fieldErrors?.linkedinurl ? true : false}
        errorMessage={fieldErrors?.linkedinurl}
      />
      <div className={`${styles.CountryCodeWrapper} w-75`} style={{ marginRight: "-30px", marginTop: "-2px" }}>
        <label className="text-left w-3/4" style={{ fontWeight: "500", fontSize: "14px" }}>
          Country*
        </label>
        <select
          id="countryCodeSelect"
          onChange={handleChange}
          name="countryCode"
          value={contactDetails.countryCode}
          className={`${styles.CountryCodeSelect} border-[0.5px] rounded-lg  border-gray-400 md:w-3/4`}
        >
          {countryCode.map((item) => (
            <option key={item?._id} value={item.code}>
              {item.iso}  {item.code}
            </option>
          ))}
        </select>
      </div>
      <CustomInput
        labelClassName={styles.SubHeading}
        label={"Phone*"}
        showLabel
        onChange={handleChange}
        name="contact"
        value={contactDetails.contact}
        isErrorState={fieldErrors && fieldErrors?.contact ? true : false}
        errorMessage={fieldErrors?.contact}
      />
      <CustomInput
        labelClassName={styles.SubHeading}
        label={"Location*"}
        showLabel
        onChange={handleChange}
        name="location"
        value={contactDetails.location}
        isErrorState={fieldErrors && fieldErrors?.location ? true : false}
        errorMessage={fieldErrors?.location}
      />
      <div className={styles.InputWrapper}>
        <Button btnType={"secondary"} text={"Cancel"} onClick={handleCancel} />
        <Button btnType={"primary"} text={"Save"} onClick={handleSubmit} />
      </div>
    </div> :
      <div className={styles.Wrapper}>
        <div>
          <h2 className={styles.Heading}>Contact Details</h2>
        </div>
        <div className={styles.InputWrapper}>
          <CustomInput
            labelClassName={styles.SubHeading}
            label={"First Name*"}
            showLabel
            onChange={handleChange}
            name="firstName"
            value={contactDetails?.firstName}
            isErrorState={fieldErrors && fieldErrors?.firstName ? true : false}
            errorMessage={fieldErrors?.firstName}
          />
          <CustomInput
            labelClassName={styles.SubHeading}
            label={"Last Name*"}
            showLabel
            onChange={handleChange}
            name="lastname"
            value={contactDetails.lastname}
            isErrorState={fieldErrors && fieldErrors?.lastname ? true : false}
            errorMessage={fieldErrors?.lastname}
          />
        </div>
        <div className={styles.InputWrapper}>
          <CustomInput
            labelClassName={styles.SubHeading}
            label={"Email*"}
            showLabel
            onChange={handleChange}
            name="email"
            type="email"
            value={contactDetails.email}
            isErrorState={fieldErrors && fieldErrors?.email ? true : false}
            errorMessage={fieldErrors?.email}
          />
        </div>
        <div className={styles.InputWrapper}>
          <CustomInput
            labelClassName={styles.SubHeading}
            label={"Linkedin profile URL*"}
            showLabel
            onChange={handleChange}
            name="linkedinurl"
            value={contactDetails.linkedinurl}
            isErrorState={fieldErrors && fieldErrors?.linkedinurl ? true : false}
            errorMessage={fieldErrors?.linkedinurl}
          />
        </div>
        <div className="w-75" style={{ marginRight: "-30px", marginTop: "-2px" }}>
          <label className="text-left w-3/4" style={{ fontWeight: "500", fontSize: "14px" }}>
            Country*
          </label>
          <select
            id="countryCodeSelect"
            onChange={handleChange}
            name="countryCode"
            value={contactDetails.countryCode}
            className="border-[0.5px] rounded-lg  border-gray-400 md:w-3/4"
          >
            {countryCode.map((item) => (
              <option key={item?._id} value={item.code}>
                {item.iso}  {item.code}
              </option>
            ))}
          </select>
        </div>
        <CustomInput
          labelClassName={styles.SubHeading}
          label={"Phone*"}
          showLabel
          onChange={handleChange}
          name="contact"
          value={contactDetails.contact}
          isErrorState={fieldErrors && fieldErrors?.contact ? true : false}
          errorMessage={fieldErrors?.contact}
        />
        <CustomInput
          labelClassName={styles.SubHeading}
          label={"Location*"}
          showLabel
          onChange={handleChange}
          name="location"
          value={contactDetails.location}
          isErrorState={fieldErrors && fieldErrors?.location ? true : false}
          errorMessage={fieldErrors?.location}
        />
        <div className={styles.InputWrapper}>
          <Button btnType={"secondary"} text={"Cancel"} onClick={handleCancel} />
          <Button btnType={"primary"} text={"Save"} onClick={handleSubmit} />
        </div>
      </div>
  );
};

export default ContactDetailsPopup;
