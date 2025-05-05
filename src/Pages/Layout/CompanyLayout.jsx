import React from "react";
import { useParams } from "react-router-dom";

// Components
import Sidebar from "../../Components/CompanyDashboard/Sidebar.jsx";

import { companyDashboardRoutes } from "../../routes.js";
import Navbar from "../../Components/CompanyDashboard/Navbar.jsx";
import CompanyForm from "../../Components/CompanyDashboard/CompanyForm.jsx";
import TermsAndConditions from "../../Components/CompanyDashboard/TermsAndConditions.jsx";

import { getUserFromId, getUserIdFromToken } from "../../service/api";
import JobDetails from "../CompanyDashboard/JobDetails.jsx";
import JobBinDetails from "../CompanyDashboard/pendingJobDetails.jsx";
import EvaluationDetails from "../CompanyDashboard/evaluationDetails.jsx";
import CandidateDetails from "../CompanyDashboard/CandidateDetails.jsx";
import CandidateReport from "../CompanyDashboard/CandidateReport.jsx";
import PreEvaluation from "../CompanyDashboard/PreEvaluation.jsx";
import "../../assets/stylesheet/layout.scss";
import TopBar from "../../Components/Global/TopBar.jsx";
import { ControlsProvider } from '../../Components/Global/controlsContext';
import Navigation from "../../Components/Global/Navigation.jsx";
import CompanyNavaigationObject from "../CompanyDashboard/CompanyNavigationObject.js";
import { getStorage, removeStorage, setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";

const CompanyDashboard = () => {

  // Component To Render
  let [comp, setComponent] = React.useState(null);
  let { component, id } = useParams();
  component = "/" + component;

  // Current User
  let [user, setUser] = React.useState(null);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  // Retrieve And Saves Access Token and User to Session
  const [access_token, setAccessToken] = React.useState(null);

  React.useEffect(() => {
    const tokenFunc = async () => {
      let access_token1 = null;
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      //const term = queryParams.get("a");

      let access_token = await getStorage("access_token");
      let user = JSON.parse(await getSessionStorage("user"));

      if (user?.access_valid === false) window.location.href = "/login";
      if (user?.user_type === "Company" || user.user_type === "Company_User") {
        //console.log("");
      } else window.location.href = "/login";
      await setAccessToken(access_token);
      await setUser(user);


      let token = await getStorage("access_token");
      if (!user || !token) {
        window.location.href = "/login";
      }

      if (user.desc == [] || user.billing == []) {
        //console.log("F");
        setModalIsOpen(true);
      } else {
        setModalIsOpen(false);
      }
    };

    const func = async () => {
      await tokenFunc();
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      //const term = queryParams.get("a");

    };
    func();
  }, []);

  React.useEffect(() => {
    if (!component || component === "/undefined") {
      setComponent(companyDashboardRoutes.filter((route) => route.path === "/")[0].component);
    } else {
      let c = companyDashboardRoutes.filter((route) => route.path === component);
      //console.log(c);
      if (c[0]) setComponent(c[0].component);
      else {
        let c1 = component.split("/");
        //console.log(id);
        if (c1[1] === "jobDetails") setComponent(<JobDetails id={id} />);
        else if (c1[1] === "pendingJobDetails") setComponent(<JobBinDetails id={id} />);
        else if (c1[1] === "candidateDetails") setComponent(<CandidateDetails id={id} />);
        else if (c1[1] === "evaluationDetails") setComponent(<EvaluationDetails id={id} />);
        else if (c1[1] === "candidateReport") setComponent(<CandidateReport />);
        //  else if (c1[1] === "preevaluation") setComponent(<PreEvaluation/>);
        else {
          let c = companyDashboardRoutes.filter(
            (route) => route.path === component.split("company/")[1]
          );
          //console.log(c);
          if (c[0]) setComponent(c[0].component);
          else
            setComponent(
              companyDashboardRoutes.filter((route) => route.path === "/company")[0].component
            );
        }
      }
    }
  }, [component]);
  return (
    <ControlsProvider>
      <div className="max-w-screen bg-slate-50 ">
        {modalIsOpen && (
          <div>
            <CompanyForm isOpen={true} setModalIsOpen={setModalIsOpen} />
          </div>
        )}
        {/* <div className="w-full fixed navbar" style={{ background: "#FAFAFA" }}>
        {" "}
        <Navbar user={user} />
      </div> */}
        <div className="w-full">
          <TopBar user={1} />
        </div>

        <div className="flex w-full fixed"> {/* Added padding-top to avoid overlap with fixed navbar */}
          <div className="apply-overlay">&nbsp;</div>
          <Navigation menu={CompanyNavaigationObject?.menu} />
          <div className="flex bg-slate-50 w-full h-full oflowx-scroll"> {/* Adjusted with margin-left to accommodate fixed sidebar */}
            {comp}
          </div>
        </div>
        {user?.acceptTC == false ? <TermsAndConditions /> : <></>}
      </div>
    </ControlsProvider>
  );
};

export default CompanyDashboard;
