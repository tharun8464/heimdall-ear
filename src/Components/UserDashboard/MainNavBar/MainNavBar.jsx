import logo_new from "../../../assets/images/logo_new.png";
import NotificationPopOver from "../../Dashbaord/Notifications";
import styles from "./MainNavBar.module.css"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Avatar from "../../../assets/images/UserAvatar.png";
import { LogoutAPI, getConfigDetails, getProfileImage, updatePassword } from "../../../service/api";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
// import "../../../assets/stylesheet/layout.scss";
// import "../../../../assets/stylesheet/NewNavbar.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import swal from "sweetalert";
import { ImCross } from "react-icons/im";
// Assets

import GridViewIcon from "@mui/icons-material/GridView";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from '@mui/icons-material/Email';
import VideocamIcon from '@mui/icons-material/Videocam';
import { MdOutlinePassword } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import getStorage, { removeStorage, setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../../service/storageService";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { InboxIcon, MailIcon } from "@heroicons/react/solid";
import useWindowSize from "../../../Hooks/useWindowSize";
import useUser from "../../../Hooks/useUser";
import { ContactlessOutlined } from "@material-ui/icons";
const MainNavBar = () => {
  let [isOpen, setIsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userProfileImage = useSelector(state => state?.profile?.userProfileImage);
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [user, setUser] = useState();
  const { handleGetUserProfileImage } = useUser()
  const { width } = useWindowSize()


  const getUser = async () => {
    let user = await JSON.parse(getSessionStorage("user"));
    if (user)
      await handleGetUserProfileImage(user?._id);
    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);



  const Logout = async () => {
    let user = await getSessionStorage("user");
    user = JSON.parse(user);
    let res = await LogoutAPI(user?._id);
    // //console.log(res);
    await removeSessionStorage("user");
    await removeStorage("access_token");
    await removeStorage("refresh_token");
    await removeSessionStorage("user_type");
    window.location.href = "/login";
    //navigate("/login");
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  React.useEffect(() => {
    const initial = async () => {
      let user = await JSON.parse(getSessionStorage("user"));
      if (user) {
        await getConfigDetails();
      }
      setUser(user);
      let step = 0;
      // if (user && user?.profileImg) {
      if (userProfileImage) {
        //let image = await getProfileImage({ id: user?._id }, user?.access_token);
        //console.log(image)
        //if (image?.status === 200) {
        setSessionStorage("profileImg", JSON.stringify(userProfileImage));

        let base64string = btoa(
          new Uint8Array(userProfileImage?.Image?.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, ""),
        );
        let src = `data:image/png;base64,${base64string}`;
        setProfileImg(src);
        //}
      }
      if (user?.resume) {
        step++;
      }
      if (user?.tools.length > 0) {
        step++;
      }
      if (user?.education.length > 0) {
        step++;
      }
      if (user?.contact !== user?.id && user?.address && user?.email) {
        step++;
      }
      if (user?.experience.length > 0) {
      }
      let progress = (step / 5) * 100;
      await setProgress(progress);
    };
    initial();
  }, [userProfileImage]);

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  const handleNavigateHome = () => {
    window.location.href = `/user`;
  }

  const handleViewProfile = () => {
    window.location.href = "/company/profile";
  }

  const handleCompleteProfile = () => {
    window.location.href = "/user/profile";
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Dashboard', 'Profile', 'Invitations', 'Interview'].map((text, index) => {
          const links = ['/user/dashboard', '/user/profile', '/user/invitations', '/user/interview'];
          return (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={links[index]}
                sx={{
                  '&:focus': {
                    outline: 'none',
                  },
                  '&:active': {
                    backgroundColor: 'transparent',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '& .MuiListItemText-root': {
                    color: 'inherit', // Ensure text color inherits from parent
                  },
                }}
              >
                <ListItemIcon>
                  {index === 0 ? <GridViewIcon /> : index === 1 ? <PersonIcon /> : index === 2 ? <EmailIcon /> : <VideocamIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <div className={styles.Navbar}>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      {width > 650 ? null : <div className="flex gap-4">
        <MenuIcon onClick={toggleDrawer(true)} />
        <img src={logo_new} onClick={handleNavigateHome} alt="valuematrix" className={styles.Logo} />
      </div>}
      <div className={styles.LogoWrapper}>
        {width > 650 ? <img src={logo_new} onClick={handleNavigateHome} alt="valuematrix" className={styles.Logo} /> : null}
        {width > 650 ? <h1 className={styles.Heading}>ValueMatrix</h1> : null}
      </div>
      <div className={styles.NavLinks}>
        <NotificationPopOver />


        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
              ${open ? "" : "text-opacity-90"} focus:outline-0`}>
                <div className="flex space-x-3 items-center cursor-pointer">

                  <img
                    src={user && user?.profileImg && profileImg ? profileImg : Avatar}
                    // src={Avatar}
                    className="h-7 w-7 md:h-7 md:w-7 rounded-full"
                    alt="userAvatar"
                  />
                </div>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1">
                <Popover.Panel className="absolute left-screen z-10 mt-3 w-[250px] -translate-x-full transform px-2 sm:px-0  ">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="bg-gray-50 p-4">
                      {progress < 100 && (
                        <div style={{ marginBottom: "1rem" }}
                          onClick={handleCompleteProfile}
                          className="text-xs cursor-pointer"
                        >
                          {/* <Link className="text-xs" to="/user/profile"> */}
                          Complete Your Profile
                          {/* </Link> */}

                        </div>
                      )}
                      <span className="flex items-center mb-3">
                        <div
                          className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer"
                          onClick={handleViewProfile}
                        >
                          {/* <Link
                            to="/user/profile"
                            className="flex space-x-2 items-center"> */}
                          <AiOutlineUser /> <p>View Profile</p>
                          {/* </Link> */}
                        </div>
                      </span>
                      <span className="flex items-center  row">
                        <div
                          className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer m-3"
                          onClick={openModal}>
                          <MdOutlinePassword /> <p>Change password</p>
                        </div>
                        <div
                          className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer m-3"
                          onClick={Logout}>
                          <MdOutlineLogout /> <p>Logout</p>
                        </div>
                      </span>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" open={isOpen} className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900">
                      Change Password
                      <div style={{ float: "right" }}>
                        <ImCross onClick={handleCloseModal} />
                      </div>
                    </Dialog.Title>
                    <div className="mt-2">
                      <Formik
                        initialValues={{
                          currentPassword: "",
                          newPassword: "",
                          confirmpassword: "",
                        }}
                        validateOnBlur={false}
                        validate={values => {
                          const errors = {};

                          if (!values.currentPassword) {
                            errors.currentPassword = "Required";
                          }
                          if (!values.newPassword) {
                            errors.newPassword = "Required";
                          }
                          if (!values.confirmpassword) {
                            errors.confirmpassword = "Required";
                          }
                          if (
                            values.newPassword !== "" &&
                            values.confirmpassword !== "" &&
                            values.newPassword !== values.confirmpassword
                          ) {
                            errors.confirmpassword = "Both password must be same";
                          }
                          if (values.newPassword === values.currentPassword) {
                            errors.newPassword =
                              "New password cannot be the same as the current password";
                          }
                          return errors;
                        }}
                        onSubmit={(values, { resetForm }) => {
                          let dataForUpdate = {
                            ...values,
                            userId: user?._id,
                          };

                          updatePassword(dataForUpdate).then(result => {
                            if (result && result.status == 200) {
                              swal({
                                title: "Success",
                                text: "Password Updated Successfully",
                                icon: "success",
                                button: "Ok",
                              }).then(() => {
                                window.location.reload();
                              });
                            } else {
                              swal({
                                icon: "error",
                                title: "Update Password",
                                text: "Incorrect Details",
                                button: "Continue",
                              }).then(() => {
                                // window.location.reload();
                                resetForm();
                              });
                            }
                          });
                        }}>
                        {({ isSubmitting }) => (
                          <Form>
                            <Field
                              type="password"
                              name="currentPassword"
                              placeholder="Current Password"
                              className="w-full"
                              style={{
                                borderRadius: "12px",
                                marginTop: "10px",
                              }}
                            />
                            <ErrorMessage
                              name="currentPassword"
                              component="div"
                              style={{ color: "red" }}
                            />
                            <Field
                              type="password"
                              name="newPassword"
                              placeholder="Enter new password"
                              className="w-full"
                              style={{
                                borderRadius: "12px",
                                marginTop: "10px",
                              }}
                            />
                            <ErrorMessage
                              name="newPassword"
                              component="div"
                              style={{ color: "red" }}
                            />
                            <Field
                              type="password"
                              name="confirmpassword"
                              placeholder="Confirm new password"
                              className="w-full"
                              style={{
                                borderRadius: "12px",
                                marginTop: "10px",
                              }}
                            />
                            <ErrorMessage
                              name="confirmpassword"
                              component="div"
                              style={{ color: "red" }}
                            />
                            <button
                              type="submit"
                              // disabled={isSubmitting}
                              className=" mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                              Submit
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default MainNavBar;
