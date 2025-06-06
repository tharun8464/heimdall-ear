import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { getUserNotification, markNotiReadForUser, deleteNotification } from "../../service/api";
import { ReactSession } from "react-client-session";
import { timeDifferenceCalculator } from "time-difference-calculator";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ls from 'localstorage-slim';
import { getStorage, getSessionStorage } from "../../service/storageService";
// Assets
import { BsBell } from "react-icons/bs";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import swal from "sweetalert"
import TopBar from "./TopBar";

const TopBarNotification = (props) => {
    const [notification, setNotification] = React.useState(null);
    const [showNoti, setShowNoti] = React.useState(null);

    // To mark notification as read
    const [read, setRead] = React.useState(true);
    const [arr, setArr] = React.useState([]);

    // To get notification count
    const [notiCount, setNotiCount] = React.useState(0);

    const getNotification = async (user, token) => {
        let res = await getUserNotification(user, token);
        if (res) {
            // console.log("res ->" , res?.data)
            setNotification(res.data?.notifications);
            const allNotifications = res.data?.notifications.filter(notif => notif.isRead === false);
            const unreadNotificationLength = allNotifications.length;
            setNotiCount(unreadNotificationLength);

        }
    };

    function sortByTime(a, b) {
        return a.timeCreated < b.timeCreated ? 1 : -1;
    }

    const markAsReadNoti = async (noti) => {
        try {
            // console.log("arr" , arr)
            if (arr.includes(noti._id)) {
                setArr(arr.filter((item) => console.log("item", item)));
                setRead(false);
            }
            else {
                setArr([...arr, noti._id]);
                setRead(true);
            }
            // console.log("Read" , read)
            setNotiCount(notiCount - 1)
            let user = JSON.parse(await getSessionStorage("user"));
            let token = await getStorage("access_token");
            let res = await markNotiReadForUser(
                { noti_id: noti._id, user_id: user._id, isRead: read },
                token
            );
            if (res) {
                // setNotification(notification.filter((item) => item._id !== noti._id));
                // console.log("res ->" , res)
            }
        } catch (error) { }
    };

    const markAllUtility = async (el, user_id, token) => {
        await markNotiReadForUser({ noti_id: el._id, user_id: user_id }, token);
    };

    const readAllNotification = async () => {
        try {
            let user = JSON.parse(await getSessionStorage("user"));
            let token = await getStorage("token");
            await notification.forEach((el) => {
                // console.log("el" , el._id)
                // markAllUtility(el, user._id, token);
                markAsReadNoti(el);
                setArr([...arr, el._id]);
                // setArr(arr.push(el._id))
                // console.log("arr" , arr)
            });
            // setNotification([]);
        } catch (err) { }
    };

    // First Popup
    // Delete One Notification
    // const handlePopup1 = async (noti)=>{
    // 	swal({
    // 		title : "Are you sure you want to delete notification ?",
    // 		text : "Click Ok to continue",
    // 		icon : "warning",
    // 		buttons : true,
    // 		dangerMode : true
    // 	}).then((res)=>{
    // 		if(res){
    // 			handleDeleteNotification(noti)
    // 			window.location.reload()
    // 		}
    // 		else{
    // 			swal("Request cancelled");
    // 		}
    // 	})
    // }

    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false);

    const handlePopup1 = async (noti) => {
        swal({
            title: "Are you sure you want to delete notification?",
            text: "Click Ok to continue",
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then(async (res) => {
            if (res) {
                await handleDeleteNotification(noti);
                setIsDeleted(true);
                // You can perform other actions here if needed
            } else {
                swal("Request cancelled");
            }
        });
    }

    if (isDeleted) {
        // You can conditionally navigate to a different route
        // For example, you might navigate to '/some-other-route'
        navigate('/');
    }

    // Delete All Notifications
    const handlePopup2 = async () => {
        swal({
            title: "Are you sure you want to delete all the notifications ?",
            text: "Click Ok to continue",
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then((res) => {
            if (res) {
                deleteAllNotification()
                // window.location.reload()
            }
            else {
                swal("Request cancelled");
            }
        })
    }
    // Delete on</svg>e notification
    const handleDeleteNotification = async (noti) => {
        try {
            // console.log("noti", noti)
            let user = JSON.parse(await getSessionStorage("user"));
            // console.log("user", user)
            let token = await getStorage("token");
            let res = await deleteNotification(
                { noti_id: noti._id, user_id: user._id },
                token
            );
            //   console.log("res", res);
            if (res?.data?.message === "Notification Deleted") {
                setNotification(notification.filter((item) => item._id !== noti._id));
            }
        } catch (err) { }
    };

    // Delete Helper
    const deleteUtility = async (el, user_id, token) => {
        await deleteNotification({ noti_id: el._id, user_id: user_id }, token);
    };

    //   Delete All Notification
    const deleteAllNotification = async () => {
        try {
            let user = JSON.parse(await getSessionStorage("user"));
            let token = await getStorage("token");
            await notification.forEach((el) => {
                deleteUtility(el, user._id, token);
            });
            setNotification([]);
            //   window.location.reload()
        } catch (err) { }
    };

    React.useEffect(() => {
        const initial = async () => {
            let user = JSON.parse(await getSessionStorage("user"));
            let token = await getStorage("access_token");
            getNotification(user, token);
        };
        initial();
    }, [notiCount]);

    return (
        <Popover className="relative mt-1">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
                    >
                        {/* {notification && notification.length > 0 && ( */}
                        {notiCount ? (
                            <div
                                className="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-1 text-xs bg-[#034488] rounded-full z-10"
                                style={{ backgroundColor: "#034488" }}
                            ></div>
                        ) : ""}
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.5 16C0.5 12.2146 0.501062 9.4259 0.788435 7.28845C1.07387 5.16538 1.63351 3.75989 2.6967 2.6967C3.75989 1.63351 5.16538 1.07387 7.28845 0.788435C9.4259 0.501062 12.2146 0.5 16 0.5H24C27.7854 0.5 30.5741 0.501062 32.7116 0.788435C34.8346 1.07387 36.2401 1.63351 37.3033 2.6967C38.3665 3.75989 38.9261 5.16538 39.2116 7.28845C39.4989 9.4259 39.5 12.2146 39.5 16V24C39.5 27.7854 39.4989 30.5741 39.2116 32.7116C38.9261 34.8346 38.3665 36.2401 37.3033 37.3033C36.2401 38.3665 34.8346 38.9261 32.7116 39.2116C30.5741 39.4989 27.7854 39.5 24 39.5H16C12.2146 39.5 9.4259 39.4989 7.28845 39.2116C5.16538 38.9261 3.75989 38.3665 2.6967 37.3033C1.63351 36.2401 1.07387 34.8346 0.788435 32.7116C0.501062 30.5741 0.5 27.7854 0.5 24V16Z" fill="#F4F7F8" />
                            <path d="M0.5 16C0.5 12.2146 0.501062 9.4259 0.788435 7.28845C1.07387 5.16538 1.63351 3.75989 2.6967 2.6967C3.75989 1.63351 5.16538 1.07387 7.28845 0.788435C9.4259 0.501062 12.2146 0.5 16 0.5H24C27.7854 0.5 30.5741 0.501062 32.7116 0.788435C34.8346 1.07387 36.2401 1.63351 37.3033 2.6967C38.3665 3.75989 38.9261 5.16538 39.2116 7.28845C39.4989 9.4259 39.5 12.2146 39.5 16V24C39.5 27.7854 39.4989 30.5741 39.2116 32.7116C38.9261 34.8346 38.3665 36.2401 37.3033 37.3033C36.2401 38.3665 34.8346 38.9261 32.7116 39.2116C30.5741 39.4989 27.7854 39.5 24 39.5H16C12.2146 39.5 9.4259 39.4989 7.28845 39.2116C5.16538 38.9261 3.75989 38.3665 2.6967 37.3033C1.63351 36.2401 1.07387 34.8346 0.788435 32.7116C0.501062 30.5741 0.5 27.7854 0.5 24V16Z" stroke="#E6E6E6" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5141 26.6627C18.9142 27.1228 19.4278 27.3756 19.9607 27.3756H19.9614C20.4967 27.3756 21.0126 27.1228 21.4134 26.6619C21.6281 26.4171 21.9942 26.3972 22.2313 26.6181C22.4692 26.8389 22.4885 27.2177 22.2746 27.4625C21.6505 28.1777 20.8295 28.5716 19.9614 28.5716H19.9599C19.0941 28.5708 18.2747 28.1769 17.653 27.4617C17.439 27.2169 17.4583 26.8381 17.6962 26.6181C17.9341 26.3964 18.3002 26.4164 18.5141 26.6627ZM19.9991 11.4287C23.4321 11.4287 25.7383 14.1891 25.7383 16.7669C25.7383 18.0929 26.065 18.655 26.4117 19.2514C26.7547 19.8399 27.1431 20.508 27.1431 21.771C26.8736 24.9979 23.6105 25.261 19.9991 25.261C16.3877 25.261 13.1239 24.9979 12.8574 21.8221C12.8551 20.508 13.2436 19.8399 13.5865 19.2514L13.7076 19.0411C14.0056 18.5122 14.26 17.9369 14.26 16.7669C14.26 14.1891 16.5661 11.4287 19.9991 11.4287ZM19.9991 12.6247C17.2999 12.6247 15.4185 14.8078 15.4185 16.7669C15.4185 18.4246 14.9728 19.1908 14.579 19.867C14.2631 20.41 14.0136 20.8389 14.0136 21.771C14.1426 23.2748 15.1041 24.065 19.9991 24.065C24.8671 24.065 25.8588 23.2397 25.987 21.7192C25.9846 20.8389 25.7352 20.41 25.4193 19.867C25.0254 19.1908 24.5798 18.4246 24.5798 16.7669C24.5798 14.8078 22.6984 12.6247 19.9991 12.6247Z" fill="#161616" />
                        </svg>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute md:left-1/2 left-[30vw] z-10 mt-3 md:w-[40vw] w-[95vw] max-w-sm -translate-x-full transform px-4 sm:px-0 lg:max-w-3xl">
                            <div style={{ height: "auto", overflow: "auto" }} className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="relative gap-8 bg-white p-3 lg:grid-cols-2 flex justify-between">
                                    <div className="flex items-center text-gray-800 space-x-2">
                                        <BsBell className="text-md" />
                                        <p>Notifications</p>{" "}
                                        <p className="text-sm">
                                            {notification && notification.length > 0 && (
                                                <p>({notiCount} unread)</p>
                                            )}
                                        </p>{" "}
                                    </div>
                                    {notification && notification.length > 0 && (
                                        <>
                                            {/* <p
										  className="text-xs text-gray-400 hover:text-blue-600 cursor-pointer"
										  onClick={readAllNotification}
										>
										  Mark all as read
										</p> */}
                                            <p
                                                className="text-xs text-gray-400 hover:text-blue-600 cursor-pointer"
                                                onClick={handlePopup2}
                                            >
                                                Delete all
                                            </p>
                                        </>
                                    )}
                                </div>
                                <div className="bg-gray-50">
                                    {(notification === null ||
                                        notification === undefined ||
                                        notification.length == 0) && (
                                            <p className="p-3">
                                                No New Notification. You are all caught up.
                                            </p>
                                        )}

                                    {notification && (
                                        <div>
                                            {notification.map((item, index) => {

                                                let formattedUtcTime = item?.timeCreated
                                                return (
                                                    <div>
                                                        <Accordion>
                                                            {item.isRead === true || arr.includes(item?._id) ? (<AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel1a-content"
                                                                id="panel1a-header"
                                                                style={{ backgroundColor: "#DDDDDD" }}
                                                            // className = {item.isRead === "true" ? ("bg-red-800") : ("")}
                                                            >
                                                                <Typography
                                                                    id="hello"
                                                                    className="font-semibold text-sm capitalize"
                                                                    style={{ fontWeight: "bold" }}
                                                                >
                                                                    {item.title}
                                                                </Typography>
                                                                <div className="text-end ml-auto text-xs">
                                                                    {/* {arr.includes(item._id) ? (
                                    									<p
                                      										className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                      										// onClick={() => {
                                        									// markAsReadNoti(item);
                                      										// }}
                                    									>
                                      									Marked as read
                                    									</p>
                                  										) : (
                                    									<p
                                    									  className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                    									  onClick={() => {
                                    									    markAsReadNoti(item);
                                    									  }}
                                    									>
                                    									  Mark as read
                                    									</p>
                                  										)} */}
                                                                    <p className="text-gray-400 hover:text-blue-600 cursor-pointer">
                                                                        Marked As Read
                                                                    </p>
                                                                    <p
                                                                        className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                                                        onClick={() => {
                                                                            handlePopup1(item);
                                                                        }}
                                                                    >
                                                                        Delete Notification
                                                                    </p>
                                                                    <p>
                                                                        {/* {timeDifferenceCalculator(item.timeCreated)} */}
                                                                        {timeDifferenceCalculator(formattedUtcTime)}

                                                                    </p>
                                                                </div>
                                                            </AccordionSummary>) : (<AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel1a-content"
                                                                id="panel1a-header"
                                                                style={{ backgroundColor: "#FFFFFF" }}
                                                            // className = {item.isRead === "true" ? ("bg-red-800") : ("")}
                                                            >
                                                                <Typography
                                                                    id="hello"
                                                                    className="font-semibold text-sm capitalize"
                                                                    style={{ fontWeight: "bold" }}
                                                                >
                                                                    {item.title}
                                                                </Typography>
                                                                <div className="text-end ml-auto text-xs">
                                                                    {/* {item.isRead === "true" ? (
                                    									<p
                                      										className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                      										// onClick={() => {
                                        									// markAsReadNoti(item);
                                      										// }}
                                    									>
                                      									Marked as read
                                    									</p>
                                  										) : (
                                    									<p
                                    									  className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                    									  onClick={() => {
                                    									    markAsReadNoti(item);
                                    									  }}
                                    									>
                                    									  Mark as read
                                    									</p>
                                  										)} */}
                                                                    <p className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                                                        onClick={() => {
                                                                            markAsReadNoti(item);
                                                                        }}
                                                                    >
                                                                        Mark as Read
                                                                    </p>
                                                                    <p
                                                                        className="text-gray-400 hover:text-blue-600 cursor-pointer"
                                                                        // onClick={() => {
                                                                        // 	handleDeleteNotification(item);
                                                                        // }}
                                                                        onClick={() => {
                                                                            handlePopup1(item)
                                                                        }}
                                                                    >
                                                                        Delete Notification
                                                                    </p>
                                                                    <p>
                                                                        {/* {timeDifferenceCalculator(item.timeCreated)} */}
                                                                        {timeDifferenceCalculator(formattedUtcTime)}

                                                                    </p>
                                                                </div>
                                                            </AccordionSummary>)}
                                                            {
                                                                item.isRead === true || arr.includes(item?._id) ? (<AccordionDetails style={{ backgroundColor: "#DDDDDD" }}>
                                                                    <Typography>
                                                                        {item.message}
                                                                    </Typography>
                                                                </AccordionDetails>) : (<AccordionDetails style={{ backgroundColor: "#FFFFFF" }}>
                                                                    <Typography>
                                                                        {item.message}
                                                                    </Typography>
                                                                </AccordionDetails>)
                                                            }
                                                        </Accordion>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default TopBarNotification;
