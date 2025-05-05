/*
* TopBar component is used to display the top bar of the application.
* It contains the logo of the application, user profile image, notification bell icon, and settings icon.
* It also contains the navigation expand button to expand and collapse the sidebar.
*/

// Required Imports
import React, { useState, useEffect, Fragment } from "react";
import Avatar from "../../assets/images/UserAvatar.png";
import logo from "../../assets/images/valuematrix-logo.svg";
import styles from "./TopBar.module.css";
import TopBarNotification from "./TopBarNotification";
import { useControls } from './controlsContext';
import { Popover, Transition } from "@headlessui/react";
import { MdOutlineLogout } from "react-icons/md";

// hooks
import { getProfileImage, getConfigDetails, LogoutAPI } from "../../service/api";
import { getSessionStorage, setSessionStorage, removeSessionStorage, removeStorage } from "../../service/storageService";
import CompanyNotifications from "./CompanyNotifications";

// TopBar Component
export default function TopBar() {

    // States
    const [user, setUser] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Navigation Expand Context
    const { navExpanded, navigationExpander, mobileDropdown, mobileSidebar, windowWidth } = useControls();

    // Get User Profile Image
    useEffect(() => {
        const initial = async () => {
            let user = await JSON.parse(getSessionStorage("user"));
            if (user) {
                await getConfigDetails();
            }
            await setUser(user);
            let step = 0;
            if (user && user.profileImg) {
                step++;
                let image = await getProfileImage({ id: user._id }, user.access_token);
                if (image?.status === 200) {
                    setSessionStorage("profileImg", JSON.stringify(image));
                    let base64string = btoa(
                        new Uint8Array(image.data.Image.data).reduce(function (data, byte) {
                            return data + String.fromCharCode(byte);
                        }, "")
                    );
                    let src = `data:image/png;base64,${base64string}`;
                    setProfileImg(src);
                }
            }
        };
        initial();
    }, []);

    const Logout = async () => {
        let user = await getSessionStorage("user");
        user = JSON.parse(user);
        let res = await LogoutAPI(user._id);
        // //console.log(res);

        await removeSessionStorage("user");
        await removeStorage("access_token");
        await removeStorage("refresh_token");
        await removeSessionStorage("user_type");
        window.location.href = "/login";
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return <>
        <section className={`dashboard-panel topbar topbar-usertype ${styles.NewNavbar}`}>
            <div className={`flex items-center navbar w-full ${styles.borderBottom}`}>
                <div className={`${styles.navigationExpandControl}`}>
                    {windowWidth > 600 ?
                        <button className={`${styles.NavigationControl}`} onClick={navigationExpander}>
                            {navExpanded ? <svg width="32" height="</g>32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_18196_25688)">
                                    <path d="M0.5 16C0.5 12.2146 0.501062 9.4259 0.788435 7.28845C1.07387 5.16538 1.63351 3.75989 2.6967 2.6967C3.75989 1.63351 5.16538 1.07387 7.28845 0.788435C9.4259 0.501062 12.2146 0.5 16 0.5C19.7854 0.5 22.5741 0.501062 24.7116 0.788435C26.8346 1.07387 28.2401 1.63351 29.3033 2.6967C30.3665 3.75989 30.9261 5.16538 31.2116 7.28845C31.4989 9.4259 31.5 12.2146 31.5 16C31.5 19.7854 31.4989 22.5741 31.2116 24.7116C30.9261 26.8346 30.3665 28.2401 29.3033 29.3033C28.2401 30.3665 26.8346 30.9261 24.7116 31.2116C22.5741 31.4989 19.7854 31.5 16 31.5C12.2146 31.5 9.4259 31.4989 7.28845 31.2116C5.16538 30.9261 3.75989 30.3665 2.6967 29.3033C1.63351 28.2401 1.07387 26.8346 0.788435 24.7116C0.501062 22.5741 0.5 19.7854 0.5 16Z" fill="#F4F7F8" stroke="#E6E6E6" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14 9.41176C14 8.63207 14.6321 8 15.4118 8H16.5882C17.3679 8 18 8.63207 18 9.41176C18 10.1915 17.3679 10.8235 16.5882 10.8235H15.4118C14.6321 10.8235 14 10.1915 14 9.41176ZM14 16C14 15.2203 14.6321 14.5882 15.4118 14.5882H16.5882C17.3679 14.5882 18 15.2203 18 16C18 16.7797 17.3679 17.4118 16.5882 17.4118H15.4118C14.6321 17.4118 14 16.7797 14 16ZM18 22.5882C18 21.8085 17.3679 21.1765 16.5882 21.1765H15.4118C14.6321 21.1765 14 21.8085 14 22.5882C14 23.3679 14.6321 24 15.4118 24H16.5882C17.3679 24 18 23.3679 18 22.5882Z" fill="#228276" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_18196_25688">
                                        <rect width="32" height="32" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                                : <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_18196_10532)">
                                        <path d="M0.5 16C0.5 12.2146 0.501062 9.4259 0.788435 7.28845C1.07387 5.16538 1.63351 3.75989 2.6967 2.6967C3.75989 1.63351 5.16538 1.07387 7.28845 0.788435C9.4259 0.501062 12.2146 0.5 16 0.5C19.7854 0.5 22.5741 0.501062 24.7116 0.788435C26.8346 1.07387 28.2401 1.63351 29.3033 2.6967C30.3665 3.75989 30.9261 5.16538 31.2116 7.28845C31.4989 9.4259 31.5 12.2146 31.5 16C31.5 19.7854 31.4989 22.5741 31.2116 24.7116C30.9261 26.8346 30.3665 28.2401 29.3033 29.3033C28.2401 30.3665 26.8346 30.9261 24.7116 31.2116C22.5741 31.4989 19.7854 31.5 16 31.5C12.2146 31.5 9.4259 31.4989 7.28845 31.2116C5.16538 30.9261 3.75989 30.3665 2.6967 29.3033C1.63351 28.2401 1.07387 26.8346 0.788435 24.7116C0.501062 22.5741 0.5 19.7854 0.5 16Z" fill="#F4F7F8" stroke="#E6E6E6" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.35742 10.6785C8.35742 10.1854 8.75717 9.78564 9.25028 9.78564H21.7503C22.2434 9.78564 22.6431 10.1854 22.6431 10.6785C22.6431 11.1716 22.2434 11.5714 21.7503 11.5714H9.25028C8.75717 11.5714 8.35742 11.1716 8.35742 10.6785ZM8.35742 15.6785C8.35742 15.1854 8.75717 14.7856 9.25028 14.7856H21.7503C22.2434 14.7856 22.6431 15.1854 22.6431 15.6785C22.6431 16.1716 22.2434 16.5713 21.7503 16.5713H9.25028C8.75717 16.5713 8.35742 16.1716 8.35742 15.6785ZM22.6431 20.6785C22.6431 20.1854 22.2434 19.7857 21.7503 19.7857H9.25028C8.75717 19.7857 8.35742 20.1854 8.35742 20.6785C8.35742 21.1716 8.75717 21.5714 9.25028 21.5714H21.7503C22.2434 21.5714 22.6431 21.1716 22.6431 20.6785Z" fill="#228276" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_18196_10532">
                                            <rect width="32" height="32" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            }
                        </button> : <button className="mobile-dropdown-caret" onClick={mobileSidebar}>
                            {mobileDropdown ? <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_15372_40307)">
                                    <path d="M0.5 16C0.5 12.2146 0.501062 9.4259 0.788435 7.28845C1.07387 5.16538 1.63351 3.75989 2.6967 2.6967C3.75989 1.63351 5.16538 1.07387 7.28845 0.788435C9.4259 0.501062 12.2146 0.5 16 0.5C19.7854 0.5 22.5741 0.501062 24.7116 0.788435C26.8346 1.07387 28.2401 1.63351 29.3033 2.6967C30.3665 3.75989 30.9261 5.16538 31.2116 7.28845C31.4989 9.4259 31.5 12.2146 31.5 16C31.5 19.7854 31.4989 22.5741 31.2116 24.7116C30.9261 26.8346 30.3665 28.2401 29.3033 29.3033C28.2401 30.3665 26.8346 30.9261 24.7116 31.2116C22.5741 31.4989 19.7854 31.5 16 31.5C12.2146 31.5 9.4259 31.4989 7.28845 31.2116C5.16538 30.9261 3.75989 30.3665 2.6967 29.3033C1.63351 28.2401 1.07387 26.8346 0.788435 24.7116C0.501062 22.5741 0.5 19.7854 0.5 16Z" fill="#F4F7F8" stroke="#E6E6E6" />
                                    <path d="M10.3529 8.5265L15.4996 13.6732L20.6196 8.55317C20.7327 8.43279 20.8689 8.3365 21.0201 8.27005C21.1713 8.20361 21.3344 8.16839 21.4996 8.1665C21.8532 8.1665 22.1923 8.30698 22.4424 8.55703C22.6924 8.80708 22.8329 9.14622 22.8329 9.49984C22.836 9.66331 22.8057 9.82569 22.7438 9.97701C22.6819 10.1283 22.5897 10.2654 22.4729 10.3798L17.2862 15.4998L22.4729 20.6865C22.6926 20.9015 22.8215 21.1926 22.8329 21.4998C22.8329 21.8535 22.6924 22.1926 22.4424 22.4426C22.1923 22.6927 21.8532 22.8332 21.4996 22.8332C21.3296 22.8402 21.1601 22.8119 21.0017 22.7499C20.8433 22.6879 20.6996 22.5937 20.5796 22.4732L15.4996 17.3265L10.3662 22.4598C10.2536 22.5762 10.119 22.6691 9.97023 22.7332C9.82148 22.7973 9.66152 22.8312 9.49957 22.8332C9.14594 22.8332 8.80681 22.6927 8.55676 22.4426C8.30671 22.1926 8.16623 21.8535 8.16623 21.4998C8.16312 21.3364 8.19345 21.174 8.25536 21.0227C8.31727 20.8713 8.40944 20.7343 8.52623 20.6198L13.7129 15.4998L8.52623 10.3132C8.30648 10.0982 8.17762 9.80705 8.16623 9.49984C8.16623 9.14622 8.30671 8.80708 8.55676 8.55703C8.80681 8.30698 9.14594 8.1665 9.49957 8.1665C9.81957 8.1705 10.1262 8.29984 10.3529 8.5265Z" fill="#228276" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_15372_40307">
                                        <rect width="32" height="32" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                                : <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_18196_10532)">
                                        <path d="M0.5 16C0.5 12.2146 0.501062 9.4259 0.788435 7.28845C1.07387 5.16538 1.63351 3.75989 2.6967 2.6967C3.75989 1.63351 5.16538 1.07387 7.28845 0.788435C9.4259 0.501062 12.2146 0.5 16 0.5C19.7854 0.5 22.5741 0.501062 24.7116 0.788435C26.8346 1.07387 28.2401 1.63351 29.3033 2.6967C30.3665 3.75989 30.9261 5.16538 31.2116 7.28845C31.4989 9.4259 31.5 12.2146 31.5 16C31.5 19.7854 31.4989 22.5741 31.2116 24.7116C30.9261 26.8346 30.3665 28.2401 29.3033 29.3033C28.2401 30.3665 26.8346 30.9261 24.7116 31.2116C22.5741 31.4989 19.7854 31.5 16 31.5C12.2146 31.5 9.4259 31.4989 7.28845 31.2116C5.16538 30.9261 3.75989 30.3665 2.6967 29.3033C1.63351 28.2401 1.07387 26.8346 0.788435 24.7116C0.501062 22.5741 0.5 19.7854 0.5 16Z" fill="#F4F7F8" stroke="#E6E6E6" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.35742 10.6785C8.35742 10.1854 8.75717 9.78564 9.25028 9.78564H21.7503C22.2434 9.78564 22.6431 10.1854 22.6431 10.6785C22.6431 11.1716 22.2434 11.5714 21.7503 11.5714H9.25028C8.75717 11.5714 8.35742 11.1716 8.35742 10.6785ZM8.35742 15.6785C8.35742 15.1854 8.75717 14.7856 9.25028 14.7856H21.7503C22.2434 14.7856 22.6431 15.1854 22.6431 15.6785C22.6431 16.1716 22.2434 16.5713 21.7503 16.5713H9.25028C8.75717 16.5713 8.35742 16.1716 8.35742 15.6785ZM22.6431 20.6785C22.6431 20.1854 22.2434 19.7857 21.7503 19.7857H9.25028C8.75717 19.7857 8.35742 20.1854 8.35742 20.6785C8.35742 21.1716 8.75717 21.5714 9.25028 21.5714H21.7503C22.2434 21.5714 22.6431 21.1716 22.6431 20.6785Z" fill="#228276" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_18196_10532">
                                            <rect width="32" height="32" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            }
                        </button>
                    }

                </div>
                <div className="text-slate-600 ml-3 text-lg 2xl:block ">
                    <img className="h-10 " src={logo} style={{ width: "187px", height: "auto" }} />
                </div>

                <div className="space-x-8 ml-auto flex items-center">
                    <div className={`top-bar-right-side`}>
                        <div className={`top-bar-right-side-options ${styles.topBarRightSide}`}>
                            {/* <div id="ReportAProblemCTA" className={`problem-report ${styles.problemReport}`}>
                            </div> */}
                            {
                                user?.user_type === "Company" ? (
                                    <CompanyNotifications />
                                ) : (
                                    <TopBarNotification />
                                )
                            }
                            {/* <button><img
                                src={
                                    user && user.profileImg && profileImg
                                        ? profileImg
                                        : Avatar
                                }
                                alt="userAvatar"
                                className={styles.avatarImg}
                            /></button> */}
                            <div className={styles.dropdown}>
                                <button onClick={toggleDropdown} className={styles.dropdownButton}>
                                    <img
                                        src={user && user.profileImg && profileImg ? profileImg : Avatar}
                                        alt="userAvatar"
                                        className={styles.avatarImg}
                                    />
                                </button>
                                {dropdownOpen && (
                                    <div className={styles.dropdownContent}>
                                        <button onClick={Logout} className={styles.dropdownItem}>Logout</button>
                                        {/* Add more dropdown items here */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    </>
}