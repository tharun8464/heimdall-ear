import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import { getStorage, removeStorage, setStorage, getSessionStorage } from "../../service/storageService";
// Components
import { XIDashboardRoutes } from "../../routes";
import Navbar from "../../Components/XIDashboard/Navbar";
import TopBar from "../../Components/Global/TopBar.jsx";
// import Sidebar from "../../Components/XIDashboard/Sidebar.jsx";
import Sidebar from "../../Components/XIDashboard/NewXIDashboard.jsx"
import Navigation from "../../Components/Global/Navigation.jsx";
import {
  getUserFromId,
  getUserIdFromToken,
  getProfileImage,
} from "../../service/api";
import jsCookie from "js-cookie";
import XiNavaigationObject from "../../Components/XIDashboard/XiNavigationObject.js";
import JobDetails from "../XIDashboard/JobDetails.jsx";
import PrintAbleUi from "../UserDashboard/PrintAbleUi.jsx";
import DetailForm from "../../Components/Dashbaord/DetailsForm.jsx";
import InterviewsDetails from "../../Pages/UserDashboard/InterviewDetails.jsx";
import TermsAndConditions from "../../Components/CompanyDashboard/TermsAndConditions.jsx";
import { ControlsProvider } from '../../Components/Global/controlsContext';

const XIDashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component, id } = useParams();
  component = "/" + component;
  let [user, setUser] = React.useState(null);
  const [detailForm, setDetailForm] = React.useState(false);

  // Retrieve And Saves Access Token and User to Session
  const [access_token, setAccessToken] = React.useState(null);
  const [profileImg, setProfileImg] = React.useState(null);

  React.useEffect(() => {
    const tokenFunc = async () => {
      let access_token = await getStorage("access_token");
      await setAccessToken(access_token);
      //let user = await JSON.parse(getSessionStorage("user"));
      let user = await JSON.parse(getSessionStorage("user"));
      await setUser(user);
      if (!user || !access_token) {
        window.location.href = "/login";
      }
    };
    tokenFunc();
  }, []);


  React.useEffect(() => {

    if (!component || component === "/undefined") {
      setComponent(
        XIDashboardRoutes.filter((route) => route.path === "/")[0].component
      );
    } else {
      let c = XIDashboardRoutes.filter((route) => route.path === component);
      if (c[0]) setComponent(c[0].component);
      else {
        let c1 = component.split("/");
        //console.log(c1);
        if (c1[1] === "jobDetails") setComponent(<JobDetails id={id} />);
        else if (c1[1] === "evaluationreport") setComponent(<PrintAbleUi id={id} />);
        else if (c1[1] === "interviewDetails") setComponent(<InterviewsDetails id={id} />);
        else {
          let c = XIDashboardRoutes.filter(
            (route) => route.path === component.split("XI/")[1]
          );
          if (c.length >= 1 && c[0] && c[0] !== undefined) setComponent(c[0].component);
          else
            setComponent(
              XIDashboardRoutes.filter((route) => route.path === "/XI")[0]
                .component
            );
        }
      }
    }
  }, [component]);

  return (
    <ControlsProvider>
      <div className="max-w-screen bg-slate-50">

        {
          detailForm && (component !== '/editProfile' && component !== '/profile') && (
            <DetailForm isOpen={true} setModalIsOpen={setDetailForm} user={user} />
          )
        }
        <div className="w-full">
          <TopBar user={1} />
        </div>

        <div className="flex w-full fixed"> {/* Added padding-top to avoid overlap with fixed navbar */}
          {/* <Sidebar className="sidebarComponent" /> */}
          <div className="apply-overlay">&nbsp;</div>
          <Navigation menu={XiNavaigationObject?.menu} />
          <div className="bg-slate-50 w-full h-full oflowx-scroll"> {/* Adjusted with margin-left to accommodate fixed sidebar */}
            {comp}
          </div>
        </div>
        {user?.acceptTC == false ? (
          <TermsAndConditions />
        ) : (
          <></>
        )}
      </div>
    </ControlsProvider>
  );
};

export default XIDashboard;
