import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Popover } from "@headlessui/react";
import styles from "./ListCard.module.css";
import React, { useEffect, useRef, useState } from "react";
import UserAvatar from "../../../assets/images/UserAvatar.png"
import ConfigureView from "../ConfigureView/ConfigureView";
import { Delete, DriveFileRenameOutline, Settings } from "@mui/icons-material";
import useList from "../../../Hooks/useList";
import { useSelector } from "react-redux";
import usePopup from "../../../Hooks/usePopup";
import ListNamePopup from "../../CompanyDashboard/PreEvaluationComponents/PreEvaluationMenu/ListNamePopup/ListNamePopup";
import DeleteListPopup from "../../CompanyDashboard/PreEvaluationComponents/PreEvaluationMenu/DeleteListPopup/DeleteListPopup";
// const members = [{ image: UserAvatar }, { image: UserAvatar }]

//simple line to check the pr status - useless

const ListCard = ({ setListId, list, setConfigureView, jobId, setListDetails }) => {
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const { listDataByJobId } = useSelector(state => state.list);
    const [members, setMembers] = useState([]);
    const { handlePopupCenterOpen, handlePopupCenterComponentRender } = usePopup()
    const { handleRemoveList } = useList();
    const handleShowConfigureView = (listId, listDet) => {
        setConfigureView(true);
        setListId(listId);
        setListDetails(listDet);
    }
    const buttonRef = useRef();
    useOutsideAlerter(buttonRef);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setIsPopoverVisible(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        }, [ref]);
    }

    useEffect(() => {

    }, [listDataByJobId]);

    useEffect(() => {
        const data = list?.listData?.map(item => ({ image: item?.profileImg }));
        setMembers(data);
    }, []);

    const handleDeletePopup = async (jobId, listId) => {
        handlePopupCenterComponentRender(<DeleteListPopup isPopoverVisible={isPopoverVisible} setIsPopoverVisible={setIsPopoverVisible} jobId={jobId} listId={listId} />)
        handlePopupCenterOpen(true);
    }

    const handleShowListNamePopup = () => {
        handlePopupCenterComponentRender(<ListNamePopup isPopoverVisible={isPopoverVisible} setIsPopoverVisible={setIsPopoverVisible} list={list} jobId={jobId} uncheckBoxes={uncheckBoxesFunc} />)
        handlePopupCenterOpen(true)
    }
    const uncheckBoxesFunc = (data) => { }

    const textColor = "#333333";
    return (
        <div className={`${styles.AddedPod} py-3`} style={{ cursor: "pointer" }}>
            {
                list &&
                (
                    <>
                        <div className={styles.NamesWrapper}>
                            <span className={styles.Name} style={{ color: textColor }}>{list?.listName}</span>
                        </div>
                        <div className="">
                            <div className={styles.ImageWrapper}>
                                {members?.map((member, index) => (
                                    <React.Fragment key={index}>
                                        {
                                            <img src={member?.image ? member?.image : UserAvatar} alt="" className={`${styles.Img} `} />
                                        }
                                    </React.Fragment>
                                ))}
                            </div>
                            <Popover className={`relative  text-sm  ${styles.Popover}`}>
                                <Popover.Button
                                    className="focus:outline-0  border-none rounded-xl text-[#888888]"
                                    onClick={() => setIsPopoverVisible(!isPopoverVisible)}
                                >
                                    <MoreVertIcon className={styles.VertIcon} style={{ color: textColor }} />
                                </Popover.Button>
                                <Popover.Panel
                                    className={`absolute z-10 w-full flex flex-col ${styles.OnSelectMenu}`}
                                    style={{ display: isPopoverVisible ? "block" : "none" }} ref={buttonRef}
                                >
                                    <div
                                        className={`overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 ${styles.OnSelectMenuWrapper}`}
                                    >

                                        <div
                                            className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.RemovePopoverBtnClass} ${styles.CursorPointer}`}
                                        >
                                            <span className="font-semibold rounded-xl flex w-full justify-left items-center gap-2"
                                                onClick={handleShowListNamePopup}
                                            >
                                                <DriveFileRenameOutline />
                                                Rename List
                                            </span>

                                        </div>
                                        <div
                                            className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.RemovePopoverBtnClass} ${styles.CursorPointer}`}
                                        >
                                            <span className="font-semibold rounded-xl flex w-full justify-left items-center gap-2" onClick={e => handleShowConfigureView(list?._id, list)}>
                                                <Settings />
                                                Configure
                                            </span>

                                        </div>
                                        <div
                                            className={`flex items-center text-gray-800 space-x-2 w-full bg-red-200 ${styles.PopoverBtnClass} ${styles.RemovePopoverBtnClass} ${styles.CursorPointer}`}
                                        >
                                            <span className="font-semibold rounded-xl flex w-full justify-left items-center gap-2"
                                                onClick={e => handleDeletePopup(list?.jobId, list?._id)}>
                                                <Delete size="small" />
                                                Remove
                                            </span>

                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Popover>
                        </div>
                    </>
                )
            }

        </div>
    );
};

export default ListCard;
