import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ReactSession } from "react-client-session";
import "tw-elements";
// Assets
import "../src/assets/stylesheet/output.css";
import "../src/assets/stylesheet/style.css";

// Pages
// import Login from "./Pages/Login.jsx";
// import Login from "./Pages/SignUp/Login";
import SignUp from "./Pages/SignInAndSignUp/SignUp";
import CandidateSignUp from "./Pages/SignInAndSignUp/CandidateSignUp";
import CompanySignUp from "./Pages/SignInAndSignUp/CompanySignUp";
import SignIn from "./Pages/SignInAndSignUp/SignIn";
import ForgotPass from "./Pages/SignInAndSignUp/ForgotPass";
import CreatePassword from "./Pages/SignInAndSignUp/CreatePassword";
import Dashboard from "./Pages/Layout/Dashboard.jsx";
import AdminLogin from "./Pages/AdminLogin.jsx";
import AdminDashboard from "./Pages/Layout/AdminLayout.jsx";
import CompanyDashboard from "./Pages/Layout/CompanyLayout.jsx";
import XIDashboard from "./Pages/Layout/XILayout.jsx";
import SuperXIDashboard from "./Pages/Layout/SuperXILayout.jsx";
import Dialer from "./dialer.jsx";
import ResetPassword from "./Components/Login/ForgotPassword.jsx";
import SetProfile from "./Pages/UserDashboard/SetProfile.jsx";
import InterviewPanel from "./Pages/InterviewPanel.jsx";
import InterviewerPanel from "./Pages/InterviewerPanel.jsx";
import Initial from "./Pages/Initial.jsx";
import Register from "./Pages/Register.jsx";
import ls from "localstorage-slim";
import swal from "sweetalert";
import { isMobile } from "react-device-detect";
import logo from "../src/assets/images/logo.png";
import RegisterFirst from "./Components/Login/RegisterFirst";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlayGames from "./Pages/PlayGames";
import ErrorBoundary from "./Components/ErrorBoundary.jsx";
import NewInterviewPanel from "./Pages/UserDashboard/NewInterviewPanel";
import PopUp from "./Components/PopUp/PopUp";
import PopUpCenter from "./Components/PopUpCenter/PopUpCenter";
import PreEvaluation from "./Pages/CompanyDashboard/PreEvaluation";
import PodManagement from "./Pages/CompanyDashboard/PodManagement/PodManagement";
import usePopup from "./Hooks/usePopup";
import { useSelector } from "react-redux";
import { store } from "./Store/store.js";
import CreatePasswordForm from "./Components/SignInAndSignUp/CreatePasswordForm";
import OtpLogin from "./Pages/SignInAndSignUp/OtpLogin";
import { SocialLogin } from "./Pages/SignInAndSignUp/SocialLogin";
import SettingProfile from "./Pages/SignInAndSignUp/SettingProfile";
import RegisterWarning from "./Pages/SignInAndSignUp/RegisterWarning";
import ResePassError from "./Pages/SignInAndSignUp/ResetPassError";
import TestGuideline from "./Pages/UserDashboard/GamifiedPsychometry/TestGuideline.jsx";
import GamifiedPsychometryTest from "./Pages/UserDashboard/GamifiedPsychometry/GamifiedPsychometryTest.jsx";
import { getSessionStorage, setSessionStorage } from "./service/storageService.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
ls.config.encrypt = true;
ReactSession.setStoreType("sessionStorage");

const MobileNotAllowedPage = () => (
  <div
    className="flex justify-center items-center h-screen"
    style={{ backgroundColor: "#f1f1f1" }}>
    <div>
      <div className="flex justify-center items-center mt-4 mb-2">
        <img src={logo} alt="Value Matrix" width="200px" />
      </div>
      <div className="flex justify-center items-center mt-4 mb-2">
        <h3 className="text-center">
          The valuematrix platform only works on <b style={{ color: "green" }}>desktop</b>{" "}
          for now{" "}
        </h3>
      </div>
    </div>
  </div>
);

const PopupWrapper = () => {
  const {
    popupComponent: componentToRender,
    popupOpen: popUpState,
    popupCenterComponent: componentToShow,
    popupCenterOpen: popUpCenterState,
    popupCenterClosingFunction,
    isClosable,
  } = useSelector(state => state.popup);

  const { handlePopupOpen, handlePopupCenterOpen } = usePopup();

  return (
    <div>
      <PopUp
        ContentComp={componentToRender}
        isOpen={popUpState}
        closeFun={() => {
          handlePopupOpen(false);
        }}
      />
      <PopUpCenter
        ContentComp={componentToShow}
        isOpen={popUpCenterState}
        closeFun={() => {
          handlePopupCenterOpen(false);
          if (popupCenterClosingFunction) {
            popupCenterClosingFunction();
          }
        }}
        isClosable={isClosable}
      />
    </div>
  );
};

//const accessToken = ls.get("user_type");
const accessToken = getSessionStorage("user_type");

const isUserAuthenticated = () => {
  const storedUser = localStorage?.getItem("access_token");
  return !!storedUser; // Check if the user exists in storage
};

const isUser = () => {
  //const user = ls.get("user_type");
  const user = getSessionStorage("user_type");
  return user && user === "User";
};

const isCompany = () => {
  //const user = ls.get("user_type");
  const user = getSessionStorage("user_type");
  return user && (user === "Company" || user === "Company_User");
};

const isAdmin = () => {
  //const user = ls.get("user_type");
  const user = getSessionStorage("user_type");
  return user && user === "Admin_User";
};

const isXi = () => {
  //const user = ls.get("user_type");
  const user = getSessionStorage("user_type");
  return user && (user === "XI" || user === "SuperXI");
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (isUserAuthenticated() && isUser()) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} />; // Redirect to the login page if the user is not authenticated
  }
};

const CompanyProtectedRoute = ({ children }) => {
  if (isUserAuthenticated() && isCompany()) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} />; // Redirect to the login page if the user is not authenticated
  }
};

const AdminProtectedRoute = ({ children }) => {
  if (isUserAuthenticated() && isAdmin()) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} />; // Redirect to the login page if the user is not authenticated
  }
};

const XiProtectedRoute = ({ children }) => {
  if (isUserAuthenticated() && isXi()) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} />; // Redirect to the login page if the user is not authenticated
  }
};



import UserNavbar from "./Components/UserDashboard/MainNavBar/MainNavBar.jsx";
import AdminNavbar from "./Components/AdminDashboard/Navbar.jsx";
import CompanyNavbar from "./Components/CompanyDashboard/Navbar.jsx";
import XINavbar from "./Components/XIDashboard/Navbar.jsx";
import connectionLost from "./assets/images/404.png";
import Playground from "./Pages/UserDashboard/Playground/Playground.jsx";
const CustomFallback = ({ error, resetError, handleNavigate }) => {
  const [userType, setUserType] = useState("");
  useEffect(() => {
    const user = getSessionStorage('user_type');
    setUserType(user);
  }, []);

  return (<div style={{ maxHeight: "100vh", overflow: "hidden" }}>
    {
      userType === 'User' && <UserNavbar />
    }
    {
      userType === 'XI' && <XINavbar />
    }
    {
      userType === 'Company' && <CompanyNavbar />
    }
    {
      userType === 'Admin_User' && <AdminNavbar />
    }
    <div className="" style={{
      backgroundImage: `url(${connectionLost})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '46rem'

    }}>
      <div className="text-center text-white">
        <h1 className="text-5xl pt-5">Something went wrong</h1>
        <p className="text-2xl">Please try again later</p>
        <button onClick={handleNavigate} style={{ border: 'none', outline: 'none' }} className="mt-2"><span className="text-xl">&#8592;</span>Back to previous page</button>
      </div>
    </div>
  </div>)
};

const App = () => {
  return (
    <Router>
      <ErrorBoundary fallback={<CustomFallback />}>
        <Routes>

          <Route path="/playground" element={<Playground />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/registerFirst" element={<RegisterWarning />} />
          <Route path="/dialer" element={<Dialer />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/otplogin" element={<OtpLogin />} />
          <Route path="/sociallogin" element={<SocialLogin />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/register/candidate" element={<CandidateSignUp />} />
          <Route path="/register/company" element={<CompanySignUp />} />
          <Route path="/register/createPassword" element={<CreatePassword />} />
          <Route path="/resetPassword/" element={<ForgotPass />} />
          <Route path="/resetPasswordError" element={<ResePassError />} />
          <Route path="/resetPassword/:id" element={<ForgotPass />} />
          <Route path="/setProfile/:id" element={<SettingProfile />} />
          {/* <Route path="/interview/:id" element={<InterviewPanel />} /> */}
          <Route path="/interview/:id" element={<NewInterviewPanel />} />
          <Route path="/interviewer/:id" element={<InterviewerPanel />} />

          {/* protected urls */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<Dashboard />} />
            <Route path="/user/:component" element={<Dashboard />} />
            <Route path="/user/:component/:id" element={<Dashboard />} />
            <Route path="user/guidelines/:id" element={<TestGuideline />} />
            <Route
              path="/user/psychometricTest/:id"
              element={<GamifiedPsychometryTest />}
            />
          </Route>

          <Route element={<CompanyProtectedRoute />}>
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/:component" element={<CompanyDashboard />} />
            <Route path="/company/:component/:id" element={<CompanyDashboard />} />
            <Route path="/company/preevaluation/:id" element={<PreEvaluation />} />
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/:component" element={<AdminDashboard />} />
            <Route path="/admin/:component/:id" element={<AdminDashboard />} />
          </Route>

          <Route element={<XiProtectedRoute />}>
            <Route path="/XI" element={<XIDashboard />} />
            <Route path="/XI/:component" element={<XIDashboard />} />
            <Route path="/XI/:component/:id" element={<XIDashboard />} />
            <Route path="/superXI" element={<SuperXIDashboard />} />
            <Route path="/superXI/:component" element={<SuperXIDashboard />} />
          </Route>
          {/* testing */}
          {/* <Route path="/company/podmanagement" element={<PodManagement />} /> */}
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

// if (isMobile) {
//   // route it to mobile not allowed component
//   root.render(<MobileNotAllowedPage />);
// } else {
root.render(
  // <ErrorBoundary fallback={<CustomFallback />}>
  <Provider store={store}>
    <ToastContainer />
    <PopupWrapper />
    <App />
  </Provider>
  // </ErrorBoundary>
);
