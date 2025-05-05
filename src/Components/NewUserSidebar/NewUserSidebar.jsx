import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GridViewIcon from "@mui/icons-material/GridView";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from '@mui/icons-material/Email';
import VideocamIcon from '@mui/icons-material/Videocam';
import styles from "./NewUserSidebar.module.css";
import { useSelector } from 'react-redux';
import { getTraitsForPlay } from '../../service/invitationService';
import PlayGamesComponent from '../Cognition/PlayGamesComponent';
import useUser from '../../Hooks/useUser';
import { getSessionStorage } from '../../service/storageService';
import useWindowSize from '../../Hooks/useWindowSize';
import swal from 'sweetalert';
import { FaLock } from 'react-icons/fa';
import { useState } from 'react';

const NewUserSidebar = () => {
    const [isProfileCompleted, setIsProfileCompleted] = useState(false);
    const [freshUser, setFreshUser] = React.useState(null);
    const [arr, setArr] = React.useState([]);
    const [traits, setTraits] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const { userDetailsWithoutLinkedin } = useSelector(state => state.user);
    const { user: userRedux } = userDetailsWithoutLinkedin ?? {};
    const hasWindow = typeof window !== "undefined";
    const { handleGetUserWithoutLinkedinFromId } = useUser()
    const { width } = useWindowSize()
    const { hasPlayedAllGames } = useSelector(state => state.preEvaluation);
    const [close, setClose] = React.useState(null);
    function getWindowDimensions() {
        const width = hasWindow ? window.innerWidth : null;
        const height = hasWindow ? window.innerHeight : null;
        return {
            width,
            height,
        };
    }

    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
    const handleGetTraitsForPlay = async () => {
        try {
            if (userRedux) {
                let traitsResp = await getTraitsForPlay(userRedux?._id);
                setTraits();

                let allMasterChallenges = [];
                traitsResp?.data?.traits?.forEach(item => {
                    allMasterChallenges.push(...item.masterchallenges);
                });
                setTraits(allMasterChallenges);
            }
        } catch (e) {

        }
    };

    useEffect(() => {
        const initial = async () => {
            let user = await getSessionStorage("user");
            user = JSON.parse(user);
            if (user)
                await handleGetUserWithoutLinkedinFromId(user?._id)
        }
        initial()
    }, [])

    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        handleGetTraitsForPlay();
    }, [userRedux]);


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
    }, [userRedux?.sectionCompletion]);

    const handleGetFreshUser = async () => {
        // const response = await getUserFromId({ id: user?._id }, user?.access_token);
        // setFreshUser(response?.data?.user);

        await handleGetUserWithoutLinkedinFromId(user?._id)
    };

    useEffect(() => {
        handleGetTraitsForPlay();
    }, [freshUser]);

    useEffect(() => {
        if (user)
            handleGetFreshUser();
    }, [user?._id]);

    const getUserDetails = async () => {
        const user = await getSessionStorage("user");
        setUser(JSON.parse(user));
    };

    React.useEffect(() => {
        getUserDetails();
        if (hasWindow) {
            function handleResize() {
                setWindowDimensions(getWindowDimensions());
            }
            setClose(getWindowDimensions().width);

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, [hasWindow]);

    //console.log(user?.inviteCog, traits?.length, !hasPlayedAllGames)
    return (
        <div className={styles.Wrapper}>
            <div
                className={`${styles.MenuWrapper} ${isActive('/user') ? styles.Active : ''}`}
                onClick={() => handleNavigation('/user')}
            >
                <GridViewIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                <span className={styles.Text}>Dashboard</span>
            </div>
            <div
                className={`${styles.MenuWrapper} ${isActive('/user/profile') ? styles.Active : ''}`}
                onClick={() => handleNavigation('/user/profile')}
            >
                <PersonIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                <span className={styles.Text}>Profile</span>
            </div>
            {!isProfileCompleted ? (
                <>
                    <div
                        className={`${styles.MenuWrapper} ${isActive('/user/interviewInvitations') ? styles.Active : ''}`}
                        onClick={() => {
                            swal({
                                icon: "error",
                                title: "Locked",
                                text: "Complete the profile to view this section",
                                button: "Continue",
                            });
                        }}
                    >
                        <EmailIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                        <span className={styles.Text}>Invitations</span>
                        <FaLock className={styles.Text} />
                    </div>
                </>
            ) : (
                <>
                    <div
                        className={`${styles.MenuWrapper} ${isActive('/user/interviewInvitations') ? styles.Active : ''}`}
                        onClick={() => handleNavigation('/user/interviewInvitations')}
                    >
                        <EmailIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                        <span className={styles.Text}>Invitations</span>
                    </div>

                </>
            )}
            {!isProfileCompleted ? (
                <>
                    <div
                        className={`${styles.MenuWrapper} ${isActive('/user/interviews') ? styles.Active : ''}`}
                        onClick={() => {
                            swal({
                                icon: "error",
                                title: "Locked",
                                text: "Complete the profile to view this section",
                                button: "Continue",
                            });
                        }}
                    >
                        <EmailIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                        <span className={styles.Text}>Interviews</span>
                        <FaLock className={styles.Text} />
                    </div>
                </>
            ) : (
                <>
                    <div
                        className={`${styles.MenuWrapper} ${isActive('/user/interviews') ? styles.Active : ''}`}
                        onClick={() => handleNavigation('/user/interviews')}
                    >
                        <VideocamIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                        <span className={styles.Text}>Interviews</span>
                    </div>
                </>
            )}
            {user?.inviteCog && traits?.length && !hasPlayedAllGames ? (
                <PlayGamesComponent customClass={styles.PlayGamesClass} isProfileCompleted={isProfileCompleted} userId={user?._id} />
            ) : null}
        </div>
    );
};

export default NewUserSidebar;
