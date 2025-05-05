import React, { useEffect, useState } from "react";
import styles from "./Navigation.module.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useUser from '../../Hooks/useUser';
import getStorage, { getSessionStorage } from '../../service/storageService';
import { MdOutlineWorkOutline } from 'react-icons/md';
import { useControls } from "./controlsContext";

const iconMap = {
    GridViewIcon: <i className="vm-icon vmicon-category" />,
    PersonIcon: <i className="vm-icon vmicon-person" />,
    EmailIcon: <i className="vm-icon vmicon-invitation" />,
    VideocamIcon: <i className="vm-icon vmicon-video" />,
    ActiveJobs: <i className="vm-icon vmicon-active" />,
    PendingJobs: <i className="vm-icon vmicon-pending" />,
    Settings: <i className="vm-icon vmicon-settings" />,
    AddUserIcon: <i className="vm-icon vmicon-adduser" />,
    UserListIcon: <i className="vm-icon vmicon-userlist" />,
    CompanyUserIcon: <i className="vm-icon vmicon-company" />,
    MdOutlineWorkOutline: <MdOutlineWorkOutline sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />,
};

export default function Navigation(props) {
    const { navExpanded, windowWidth, mobileDropdown } = useControls();
    const { menu } = props;
    const [activeButton, setActiveButton] = useState(null);
    const [isProfileCompleted, setIsProfileCompleted] = useState(false);
    const [counts, setCounts] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState({});
    const user_details = getSessionStorage("user_type");

    useEffect(() => {
        if (Array.isArray(menu) && menu.length > 0 && menu[0].buttons && menu[0].buttons.length > 0) {
            setActiveButton(menu[0].buttons[0]);
        } else if (menu.navItems && menu.navItems.length > 0) {
            setActiveButton(menu.navItems[0]);
        }
    }, [menu]);

    useEffect(() => {
        const fetchCounts = async () => {
            const fetchedCounts = {
                "/XI/jobinterviews": 15,
            };
            setCounts(fetchedCounts);
        };

        fetchCounts();
    }, []);

    const renderCount = (menuItem) => {
        return menuItem ? "99+" : null;
    }

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const handleDropdownToggle = (index) => {
        setDropdownOpen(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const navigate = useNavigate();
    const location = useLocation();

    const { userDetailsWithoutLinkedin } = useSelector(state => state.user);
    const { user: userRedux } = userDetailsWithoutLinkedin ?? {};
    const { handleGetUserWithoutLinkedinFromId } = useUser();
    const isUserAuthenticated = () => {
        const storedUser = localStorage?.getItem("access_token");
        return !!storedUser;
    };

    const isUser = () => {
        const user = getSessionStorage("user_type");
        return user && user === "User";
    };

    const isCompany = () => {
        const user = getSessionStorage("user_type");
        return user && (user === "Company" || user === "Company_User");
    };

    const isAdmin = () => {
        const user = getSessionStorage("user_type");
        return user && user === "Admin_User";
    };

    const isXi = () => {
        const user = getSessionStorage("user_type");
        return user && (user === "XI" || user === "SuperXI");
    };

    const protectedRoute = (navigatePath) => {
        if (isUserAuthenticated() && (isXi() || isCompany() || isUser() || isAdmin())) {
            navigate(navigatePath);
        } else {
            navigate("/login");
        }
    };

    useEffect(() => {
        const initial = async () => {
            let user = await getSessionStorage("user");
            user = JSON.parse(user);
            await handleGetUserWithoutLinkedinFromId(user?._id)
        }
        initial()
    }, [])

    const handleNavigation = (path) => {
        protectedRoute(path);
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        if (userRedux) {
            let allSectionsCompleted = true;
            for (const key in userRedux?.sectionCompletion) {
                if (!userRedux?.sectionCompletion[key]) {
                    allSectionsCompleted = false;
                    break;
                }
            }

            if (allSectionsCompleted) {
                setIsProfileCompleted(true);
            } else {
                setIsProfileCompleted(false);
            }
        }
    }, [userRedux]);

    const renderButtonGroup = () => {
        if (Array.isArray(menu)) {
            return menu.map((item, index) => {
                if (item.enabled && item.buttons) {
                    return (
                        <div key={index} className={`btn-group ${styles.navigationButton}`} role="group" aria-label="Basic example">
                            {item.buttons.map((button, btnIndex) => (
                                <button
                                    key={btnIndex}
                                    type="button"
                                    className={`${button === activeButton ? styles.ButtonGroupActive : ''}`}
                                    onClick={() => handleButtonClick(button)}
                                    disabled={button?.locked ?? false}
                                >
                                    {navExpanded ? button.label : button.shortLabel}
                                </button>
                            ))}
                        </div>
                    );
                }
                return null;
            });
        }
        return null;
    };

    const renderNavItems = () => {
        if (activeButton && activeButton.navItems) {
            return (
                <div className={styles.navItems}>
                    {activeButton.navItems.map((navItem, navIndex) => (
                        <div key={navIndex}>
                            <button
                                className={`${styles.MenuWrapper} ${isActive(navItem.path) ? styles.Active : ''}`}
                                onClick={() => navItem.dropdown ? handleDropdownToggle(navIndex) : handleNavigation(navItem.path)}
                                disabled={!isCompany() && navItem?.locked ? !isProfileCompleted ? true : false : false}
                            >
                                <span> {iconMap[navItem.icon]}
                                    {(windowWidth > 600 && navExpanded) || windowWidth <= 600 ? (
                                        <span className={styles.Text}>{navItem.name}</span>
                                    ) : null}
                                </span>

                                {navItem?.count && !navItem?.locked && (
                                    <span className={styles.counts}>{renderCount(navItem.path)}</span>
                                )}
                                {navItem?.locked ? !isCompany() && !isProfileCompleted && (
                                    <span className={styles.locked}>
                                        <i className="vm-icon vmicon-lock" />
                                    </span>
                                ) : ""}
                            </button>
                            {navItem.dropdown && dropdownOpen[navIndex] && (
                                <div className={styles.dropdownContent}>
                                    {navItem.dropdown.map((dropdownItem, dropdownIndex) => (
                                        <button
                                            key={dropdownIndex}
                                            className={`${styles.MenuWrapper} ${isActive(dropdownItem.path) ? styles.Active : ''}`}
                                            onClick={() => handleNavigation(dropdownItem.path)}
                                            disabled={!isCompany() && dropdownItem?.locked ? !isProfileCompleted ? true : false : false}
                                        >
                                            <span> {iconMap[dropdownItem.icon]}
                                                {(windowWidth > 600 && navExpanded) || windowWidth <= 600 ? (
                                                    <span className={styles.Text}>{dropdownItem.name}</span>
                                                ) : null}
                                            </span>

                                            {dropdownItem?.count && !dropdownItem?.locked && (
                                                <span className={styles.counts}>{renderCount(dropdownItem.path)}</span>
                                            )}
                                            {dropdownItem?.locked ? !isCompany() && !isProfileCompleted && (
                                                <span className={styles.locked}>
                                                    <i className="vm-icon vmicon-lock" />
                                                </span>
                                            ) : ""}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        } else if (menu.navItems) {
            return (
                <div className={styles.navItems}>
                    {menu.navItems.map((navItem, navIndex) => (
                        <div key={navIndex} className={navItem?.dropdown ? styles?.dropdownWrapper : "normal-button"}>
                            <button
                                className={`${styles.MenuWrapper} ${isActive(navItem.path) ? styles.Active : ''}`}
                                onClick={() => navItem.dropdown ? handleDropdownToggle(navIndex) : handleNavigation(navItem.path)}
                                disabled={!isCompany() && navItem?.locked ? !isProfileCompleted ? true : false : false}
                            >
                                <span> {iconMap[navItem.icon]}
                                    {(windowWidth > 600 && navExpanded) || windowWidth <= 600 ? (
                                        <span className={styles.Text}>{navItem.name}</span>
                                    ) : null}
                                </span>

                                {navItem?.count && !navItem?.locked && (
                                    <span className={styles.counts}>{renderCount(navItem.path)}</span>
                                )}

                                {navItem?.locked ? !isCompany() && !isProfileCompleted && (
                                    <span className={styles.locked}>
                                        <i className="vm-icon vmicon-lock" />
                                    </span>
                                ) : ""}

                                {!navItem?.locked && navItem?.dropdown && (dropdownOpen[navIndex] ? <span className={styles.arrowUp}><i className="vm-icon vmicon-up" /></span> : <span className={styles.arrowDown}><i className="vm-icon vmicon-down" /></span>)}
                            </button>
                            {navItem.dropdown && dropdownOpen[navIndex] && (
                                <div className={styles.dropdownContent}>
                                    {navItem.dropdown.map((dropdownItem, dropdownIndex) => (
                                        <button
                                            key={dropdownIndex}
                                            className={`${styles.MenuWrapper} ${isActive(dropdownItem.path) ? styles.Active : ''}`}
                                            onClick={() => handleNavigation(dropdownItem.path)}
                                            disabled={!isCompany() && dropdownItem?.locked ? !isProfileCompleted ? true : false : false}
                                        >
                                            <span> {iconMap[dropdownItem.icon]}
                                                {(windowWidth > 600 && navExpanded) || windowWidth <= 600 ? (
                                                    <span className={styles.Text}>{dropdownItem.name}</span>
                                                ) : null}
                                            </span>

                                            {dropdownItem?.count && !dropdownItem?.locked && (
                                                <span className={styles.counts}>{renderCount(dropdownItem.path)}</span>
                                            )}

                                            {dropdownItem?.locked ? !isCompany() && !isProfileCompleted && (
                                                <span className={styles.locked}>
                                                    <i className="vm-icon vmicon-lock" />
                                                </span>
                                            ) : ""}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`${styles.Wrapper} ${windowWidth > 600 ? navExpanded ? styles.Expanded : styles.Collapsed : mobileDropdown ? styles.sidebarOpen : styles.sidebarClose}`}>
            <div className={styles.navTopArea}>
                {renderButtonGroup()}
                {renderNavItems()}
            </div>
        </div>
    );
}