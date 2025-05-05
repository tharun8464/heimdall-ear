import React, { Fragment, useEffect } from 'react'
import { Popover, Transition } from "@headlessui/react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { BsBell } from "react-icons/bs";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useNotifications from "../../Hooks/useNotifications";
import { useParams } from 'react-router-dom';
import { getSessionStorage } from '../../service/storageService';
import { useSelector } from 'react-redux';
const CompanyNotifications = () => {
    const [user, setUser] = React.useState(null);
    const { id: jobId } = useParams();
    const { handleGetNotification } = useNotifications()
    const notifications = useSelector((state) => state?.notification?.notificationData);
    console.log("notifications", notifications)

    useEffect(() => {
        const user = JSON.parse(getSessionStorage("user"));
        setUser(user);
    }, [])

    useEffect(() => {
        if (user && user?._id) {
            const data = {
                jobId: jobId,
                to: user?._id
            }
            handleGetNotification(data)
        }
    }, [user?._id])

    return (
        <Popover className="relative mt-1">
            {({ open }) => (
                <>
                    <Popover.Button className={`${open ? "" : "text-opacity-90"} focus:outline-0`}>
                        {notifications?.length > 0 ? (
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
                                            {notifications && notifications.length > 0 && (
                                                <p>({notifications?.length} unread)</p>
                                            )}
                                        </p>{" "}
                                    </div>
                                    {/* {notifications && notifications.length > 0 && (
                                        <>
                                             <p
                                                className="text-xs text-gray-400 hover:text-blue-600 cursor-pointer"
                                                onClick={handlePopup2}
                                            >
                                                Delete all
                                            </p>
                                        </>
                                    )} */}
                                </div>
                                <div className="bg-gray-50">
                                    {(notifications === null ||
                                        notifications === undefined ||
                                        notifications?.length == 0) && (
                                            <p className="p-3">
                                                No New Notification. You are all caught up.
                                            </p>
                                        )}
                                    {
                                        notifications?.length > 0 && (
                                            <div>
                                                {
                                                    notifications?.map((item, index) => {
                                                        return (
                                                            <Accordion key={item?._id}>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                    style={{ backgroundColor: "#DDDDDD" }}

                                                                >
                                                                    <Typography
                                                                        id="hello"
                                                                        className="font-semibold text-sm capitalize"
                                                                        style={{ fontWeight: "bold" }}
                                                                    >
                                                                        {"Renew message sent"}
                                                                        <br />
                                                                        {"View Details"}

                                                                    </Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Typography>
                                                                        List name {item?.report?.listName} needs to be renewed!
                                                                    </Typography>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default CompanyNotifications