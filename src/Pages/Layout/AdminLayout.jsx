import React from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";

// Components
import { adminDashboardRoutes } from "../../routes";
import Navbar from "../../Components/AdminDashboard/Navbar.jsx";
import Sidebar from "../../Components/AdminDashboard/Sidebar.jsx";
import { getUserFromId, getUserIdFromToken } from "../../service/api";
import jsCookie from "js-cookie";
import "../../assets/stylesheet/layout.scss"
import AdminUserProfile from "../AdminDashboard/AdminUserProfile.jsx";
import JobDetails from "../AdminDashboard/JobDetails.jsx";
import PendingJobDetails from "../CompanyDashboard/pendingJobDetails.jsx";
import TermsAndConditions from "../../Components/CompanyDashboard/TermsAndConditions.jsx";
import { getStorage, removeStorage, setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";

const AdminDashboard = () => {
  // Component To Render
  let [comp, setComponent] = React.useState(null);
  let { component, id } = useParams();
  component = "/" + component;
  //console.log(id)
  // Current User
  let [user, setUser] = React.useState(null);

  // Retrieve And Saves Access Token and User to Session
  const [access_token, setAccessToken] = React.useState(null);

  React.useEffect(() => {
    const tokenFunc = async () => {

      let access_token = await getStorage("access_token");
      let user = JSON.parse(await getSessionStorage("user"));

      if (user.access_valid === false) window.location.href = "/login";
      if (
        user.user_type === "Admin" ||
        (user.user_type === "Admin_User" || user.isAdmin === true)
      ) {
        //console.log("");
      }
      else window.location.href = "/login";
      await setAccessToken(access_token);
      await setUser(user);


      let token = await getStorage("access_token");
      if (!user || !token) {
        window.location.href = "/login";
      }
    };

    const func = async () => {
      await tokenFunc();
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      //const term = queryParams.get("a");

    };
    func();
  }, [access_token]);
  React.useEffect(() => {
    if (!component || component === "/undefined") {
      setComponent(
        adminDashboardRoutes.filter((route) => route.path === "/")[0].component
      );
    } else {
      let c = adminDashboardRoutes.filter((route) => route.path === component);
      if (c[0]) setComponent(c[0].component);
      else {
        let c1 = component.split("/");
        //console.log(c1);
        if (c1[1] === "AdminUserProfile") setComponent(<AdminUserProfile id={id} />);
        else if (c1[1] === "jobDetails") setComponent(<JobDetails id={id} />);
        else if (c1[1] === "pendingJobDetails") setComponent(<PendingJobDetails id={id} />);
        else {
          let c = adminDashboardRoutes.filter(
            (route) => route.path === component.split("admin/")[1]
          );
          if (c.length >= 1 && c[0] && c[0] !== undefined) setComponent(c[0].component);
          else
            setComponent(
              adminDashboardRoutes.filter((route) => route.path === "/admin")[0]
                .component
            );
        }
      }

    }
  }, [component]);

  return (
    <div className="max-w-screen bg-slate-50 h-full">
      <div className="w-full  grid-flow-row   fixed navbar"
        style={{ background: "#FAFAFA" }}
      >
        {" "}
        <Navbar user={user} />
      </div>

      <div className="flex grid-flow-row w-full ">
        <Sidebar className="sidebarComponent"></Sidebar>
        <div className="mt-10 w-full">{comp}</div>
      </div>
      {user?.acceptTC === false ? (
        <TermsAndConditions />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminDashboard;
