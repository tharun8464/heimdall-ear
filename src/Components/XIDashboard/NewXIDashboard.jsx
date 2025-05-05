import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GridViewIcon from "@mui/icons-material/GridView";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from '@mui/icons-material/Email';
import VideocamIcon from '@mui/icons-material/Videocam';
import styles from "./NewXiSidebar.module.css";
import { useSelector } from 'react-redux';
import useUser from '../../Hooks/useUser';
import getStorage from '../../service/storageService';
import { MdOutlineWorkOutline } from 'react-icons/md';

const NewXIDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const { userDetailsWithoutLinkedin } = useSelector(state => state.user);
    const { user: userRedux } = userDetailsWithoutLinkedin ?? {};
    const { handleGetUserWithoutLinkedinFromId } = useUser()

    const handleNavigation = (path) => {
        navigate(path);
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const initial = async () => {
            let user = await getStorage("user");
            user = JSON.parse(user);
            if (user)
                await handleGetUserWithoutLinkedinFromId(user?._id)
        }
        initial()
    }, [])
    return (
        <div className={styles.Wrapper}>
            <div
                className={`${styles.MenuWrapper} ${isActive('/XI') ? styles.Active : ''}`}
                onClick={() => handleNavigation('/XI')}
            >
                <GridViewIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                <span className={styles.Text}>Dashboard</span>
            </div>
            <div
                className={`${styles.MenuWrapper} ${isActive('/XI/profile') ? styles.Active : ''}`}
                onClick={() => handleNavigation('/XI/profile')}
            >
                <PersonIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                <span className={styles.Text}>Profile</span>
            </div>
            <div
                className={`${styles.MenuWrapper} ${isActive('/XI/interviewInvitations') ? styles.Active : ''}`}
                onClick={() => handleNavigation('/XI/interviewInvitations')}
            >
                <EmailIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                <span className={styles.Text}>Invitations</span>
            </div>
            <div
                className={`${styles.MenuWrapper} ${isActive('/XI/jobinterviews') ? styles.Active : ''}`}
                onClick={() => handleNavigation('/XI/jobinterviews')}
            >
                <VideocamIcon sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                <span className={styles.Text}>Interviews</span>
            </div>
            <div
                className={`${styles.MenuWrapper} ${isActive('/XI/evaluationlist') ? styles.Active : ''}`}
                onClick={() => handleNavigation('/XI/evaluationlist')}
            >
                <MdOutlineWorkOutline sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                <span className={styles.Text}>Matched Interviews</span>
            </div>
            <div
                className={`${styles.MenuWrapper} ${isActive('/XI/slots') ? styles.Active : ''}`}
                onClick={() => handleNavigation('/XI/slots')}
            >
                <MdOutlineWorkOutline sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                <span className={styles.Text}>Slots</span>
            </div>
            {/* <div
                className={`${styles.MenuWrapper} ${isActive('/XI/slotsv2') ? styles.Active : ''}`}
                onClick={() => handleNavigation('/XI/slotsv2')}
            >
                <MdOutlineWorkOutline sx={{ color: "var(--icon-grey)", fontSize: "25px" }} />
                <span className={styles.Text}>Slotsv2</span>
            </div> */}
        </div>
    )
}

export default NewXIDashboard