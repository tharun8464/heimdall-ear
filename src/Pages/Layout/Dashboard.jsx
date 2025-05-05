import React from "react";
import { useParams } from "react-router-dom";
import OneSignal from "react-onesignal";

// Components

import JobDetails from "../UserDashboard/JobDetail.jsx";
import InterviewDetails from "../UserDashboard/InterviewDetails.jsx";
import CandidateResumeForm from "../../Components/Dashbaord/CandidateForm.jsx";
import { dashboardRoutes } from "../../routes";
import HorizontalNav from "../../Components/Dashbaord/Navbar";
import SidebarComponent from "../../Components/Dashbaord/sidebar";
import DetailForm from "../../Components/Dashbaord/DetailsForm.jsx";
import { getProfileImage, getUserFromId, getUserIdFromToken } from "../../service/api";
import { Link } from "react-router-dom";
import "../../assets/stylesheet/layout.scss";
import TermsAndConditions from "../../Components/CompanyDashboard/TermsAndConditions.jsx";
import { getStorage, removeStorage, setStorage, getSessionStorage } from "../../service/storageService";
import MainNavBar from "../../Components/UserDashboard/MainNavBar/MainNavBar.jsx";
import styles from "./Dashboard.module.css"
import NewCompanySideBar from "../../Components/CompanyDashboard/NewCompanySideBar/NewCompanySideBar.jsx";
import NewUserSidebar from "../../Components/NewUserSidebar/NewUserSidebar.jsx";

const Dashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component, id } = useParams();
  component = "/" + component;
  let [access_token, setAccessToken] = React.useState(null);
  let [user, setUser] = React.useState(null);
  let [profileImg, setProfileImg] = React.useState(null);
  let [userCheck, setUserCheck] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  // Form to get User details
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [detailForm, setDetailForm] = React.useState(false);
  React.useEffect(() => {
    OneSignal.init({
      appId: "91130518-13a8-4213-bf6c-36b55314829a",
      safari_web_id: "web.onesignal.auto.2cee7bb2-7604-4e25-b1d2-cbd521c730a5",
      notifyButton: {
        enable: true,
      },
    });
  }, []);

  // Set Access_Token And User to the Session Storage

  React.useEffect(() => {
    const tokenFunc = async () => {
      let access_token = await getStorage("access_token");
      await setAccessToken(access_token);
      //let user = JSON.parse(getStorage("user"));
      const user = JSON.parse(getSessionStorage("user"));
      if (user.invite) {
        window.location.href = "/setProfile/" + user.resetPassId;
      }
      await setUser(user);
      if (user.access_valid === false || user.user_type !== "User") {
        window.location.href = "/login";
      }
      if (!user || !access_token) {
        window.location.href = "/login";
      }
    };
    tokenFunc();
  }, []);

  // Get Component To Render from the URL Parameter
  React.useEffect(() => {
    if (component === null) {
      let c = dashboardRoutes.filter(route => route.path === "");
      setComponent(c[0].component);
    } else {
      let c = dashboardRoutes.filter(route => route.path === component);
      if (c[0]) setComponent(c[0].component);
      else {
        let c1 = component.split("/");
        if (c1[1] === "jobDetails") setComponent(<JobDetails id={id} />);
        if (c1[1] === "interviewDetails") setComponent(<InterviewDetails id={id} />);
        else {
          let c = dashboardRoutes.filter(route => route.path === component.split("/")[1]);
          if (c[0]) setComponent(c[0].component);
          else
            setComponent(dashboardRoutes.filter(route => route.path === "")[0].component);
        }
      }
    }
  }, [component]);

  return (
    <div className="max-w-screen bg-slate-50 h-screen" style={{ background: "#fff" }}>
      {modalIsOpen && component !== "/editProfile" && (
        <div>
          <CandidateResumeForm isOpen={true} setModalIsOpen={setModalIsOpen} />
        </div>
      )}
      <MainNavBar />
      <div className={`${styles.SidebarAndViewWrapper}`}>
        <NewUserSidebar />
        {comp}
      </div>
      {user?.acceptTC === false ? <TermsAndConditions /> : <></>}
    </div>
  );
};

export default Dashboard;
