import { ProSidebar, Menu, MenuItem, SubMenu, SidebarContent } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "../../assets/stylesheet/layout.scss";
import { companyDashboardRoutes } from "../../routes";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineConsoleSql,
  AiOutlineHome,
  AiOutlinePlus,
  AiOutlineFolderAdd,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import React from "react";
import "../../assets/stylesheet/sidebar.scss";
import { getUserFromId } from "../../service/api";
import { ImHome } from "react-icons/im";
import { FiSettings } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import { LogoutAPI } from "../../service/api";
import ls from "localstorage-slim";
import { getStorage, removeStorage, setStorage } from "../../service/storageService";
import { useNavigate } from "react-router-dom";
import { setSessionStorage, getSessionStorage, removeSessionStorage } from "../../service/storageService";
const Sidebar = () => {
  const [open, setOpen] = React.useState(true);
  const [toggled, setToggled] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);
  const [close, setClose] = React.useState(null);
  const hasWindow = typeof window !== "undefined";
  const navigate = useNavigate();

  const [arr, setArr] = React.useState([]);

  const Logout = async () => {
    // //console.log("CHeck");
    let user = await getSessionStorage("user");
    user = JSON.parse(user);
    let res = await LogoutAPI(user._id);
    await removeSessionStorage("user");
    await removeStorage("access_token");
    await removeStorage("refresh_token");
    await removeSessionStorage("user_type");
    navigate("/login");
  };
  const [permission, setPermissions] = React.useState({
    add_jobs: true,
    add_users: true,
    list_candidates: true,
    default: true,
  });

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    // //console.log(width);
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

  React.useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      setClose(getWindowDimensions().width);
      // //console.log(getWindowDimensions().width);

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  const handleToggle = () => {
    if (close < 1336) {
      setToggled(!toggled);
      setCollapsed(!collapsed);
    }
  };

  React.useEffect(() => {
    const initial = async () => {
      let user1 = JSON.parse(await getSessionStorage("user"));
      let token = await getStorage("access_token");
      let user = await getUserFromId({ id: user1._id }, token);
      // //console.log(user);
      if (
        user &&
        user.data.user &&
        user.data.user.user_type === "Company_User" &&
        user.data.user.permissions
      ) {
        if (user.data.user.permissions[0]) {
          await setPermissions({
            ...user.data.user.permissions[0].company_permissions,
            default: true,
          });
        }
      }
      // //console.log(permission);
    };
    initial();
  }, []);

  // const handleClick = (id) => {
  //   setArr([id]);
  // };


  return (
    <div className="sidebarComponent z-20">
      <div className="h-screen fixed top-20 left-0">
        <div
          className="absolute text-gray-700 text-xl left-5 -top-14"
          style={{ zIndex: 18 }}
        >
          <AiOutlineMenu
            className="text-md menu-bar"
            onClick={handleToggle}
            style={{ zIndex: 20 }}
          />
        </div>
        <ProSidebar
          className="fixed left-0 h-screen z-0 text-left text-gray-500 active"
          style={{ backgroundColor: "#FAFAFA", zIndex: -1 }}
          breakPoint="xl"
          collapsed={collapsed}
          toggled={toggled}
          onToggle={handleToggle}
        >
          <div className="w-full px-6" onClick={handleToggle}>
            <Link to="/company/jobsAdd">
              <button
                className="hover:bg-blue-700 flex text-white font-bold py-2 w-full text-sm mt-4 text-center rounded-lg"
                style={{ backgroundColor: "#228276" }}
              >
                <p className="mx-auto flex">
                  <p className="py-1 px-2 text-md">
                    <AiOutlinePlus />
                  </p>
                  Post New Job
                </p>
              </button>
            </Link>
          </div>
          <SidebarContent className="text-left mx-1 mt-2">
            <Menu iconShape="square">
              <MenuItem
                className="text-gray-700 font-semibold flex"
                active={
                  window.location.pathname === `/company/` ||
                  window.location.pathname === `/company`
                }
                onClick={handleToggle}
              >
                <p className="text-xl flex mx-2">
                  <AiOutlineHome />
                  <p className="text-sm mx-4 text-gray-700 font-semibold">Dashboard</p>
                </p>
                <Link to={`/company/`} />
              </MenuItem>

              <MenuItem
                className="text-gray-700 font-semibold flex"
                active={
                  window.location.pathname === `/company/` ||
                  window.location.pathname === `/company`
                }
                onClick={handleToggle}
              >
                <p className="text-xl flex mx-2">
                  <AiOutlineHome />
                  <p className="text-sm mx-4 text-gray-700 font-semibold">newDashboard</p>
                </p>
                <Link to={`/company`} />
              </MenuItem>

              <p className="text-gray-400 font-bold text-xs mx-4 my-4">Menu</p>

              {companyDashboardRoutes.map((item, id) => {
                if (item.hide === false && permission[item.permission] !== false) {
                  return (
                    <MenuItem
                      key={id}
                      className={arr.includes(id) ? "text-gray-800 font-bold" : "text-gray-400 font-semibold"}
                      active={window.location.pathname === `/company${item.path}`}
                      icon={item.icon}
                    >
                      {item.name}
                      <Link
                        to={`/company${item.path}`}
                        onClick={() => {
                          setOpen(true);
                          handleToggle();
                        }}
                      />
                    </MenuItem>
                  );
                }
                return null;
              })}

              <SubMenu
                title={<p className="text-sm font-semibold">Company User</p>}
                icon={<p className="text-lg"><AiOutlineMenu /></p>}
              >
                <MenuItem
                  className="text-gray-700 font-semibold"
                  active={window.location.pathname === `/company/addCompanyUser`}
                  icon={<AiOutlineFolderAdd />}
                >
                  Add Users
                  <Link
                    to={`/company/addCompanyUser`}
                    onClick={() => setOpen(true)}
                  />
                </MenuItem>
                <MenuItem
                  className="text-gray-700 font-semibold py-1"
                  active={window.location.pathname === `/company/CompanyUserList`}
                  icon={<AiOutlineMenu />}
                >
                  Users List
                  <Link
                    to={`/company/CompanyUserList`}
                    onClick={() => setOpen(true)}
                  />
                </MenuItem>
              </SubMenu>
            </Menu>
          </SidebarContent>
          <div className="mx-1 mb-32 ">
            <div className="flex m-2">
              <a href="/company/profile" className="text-gray-700 mx-4 py-2 font-semibold">
                <FiSettings />
              </a>
              <a href="/company/masking" className="text-gray-700 font-semibold py-1">
                Settings
              </a>
            </div>
            <div className="flex m-2" onClick={Logout}>
              <p className="text-gray-700 mx-4 py-2 font-semibold">
                <MdOutlineLogout />
              </p>
              <p className="text-gray-700 font-semibold py-1 cursor-pointer">Log Out</p>
            </div>
          </div>
        </ProSidebar>
      </div>
    </div>
  );
};

export default Sidebar;
