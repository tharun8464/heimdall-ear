import React, { useEffect, useState } from "react";
import { Close } from "@material-ui/icons";
import styles from "./ManageListComponent.module.css";
import CustomInput from "../CustomInput/CustomInput";
import Button from "../Button/Button";
import ListCard from "./ListCard/ListCard";
import ConfigureView from "./ConfigureView/ConfigureView";
import usePopup from "../../Hooks/usePopup";
import ListNamePopup from "../CompanyDashboard/PreEvaluationComponents/PreEvaluationMenu/ListNamePopup/ListNamePopup";
import useList from "../../Hooks/useList";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


const ManageListComponent = ({ setShowManageList, selectedCandidatesForList, setManageListShare, setUncheckBoxes }) => {
    const [listSearch, setListSearch] = useState("");
    const [configureView, setConfigureView] = useState(false);
    const [lists, setLists] = useState();
    const { handlePopupCenterOpen, handlePopupCenterComponentRender } = usePopup()
    const { listDataByJobId } = useSelector(state => state.list);
    const { handleGetListByJobId } = useList();
    const { id: jobId } = useParams();
    const [listId, setListId] = useState();
    const [listDetails, setListDetails] = useState();
    // const email = ['atul.verma@valuematrix.ai', 'gagandeep.singh@valuematrix.ai'];
    const [email, setEmail] = useState([]);
    const { handleSetConfiguration } = useList();
    const [isWaterMarkAdded, setIsWaterMarkAdded] = useState(false);
    const [isShowAnalytics, setIsShowAnalytics] = useState(false);
    const [visits, setVisits] = useState(10);
    const [sharedTo, setSharedTo] = useState([]);
    const [passcode, setPasscode] = useState("");
    const [isShareByEmail, setIsShareByEmail] = useState(true);
    const [expiryDate, setExpiryDate] = useState("2025-12-30T12:34:56.789Z");
    const [dataFromConfigureView, setDataFromConfigureView] = useState({});

    const handleClose = () => {
        setShowManageList(false)
        setManageListShare(false)
    }

    useEffect(() => {
        const initial = async (jobid) => {
            await handleGetListByJobId(jobid)
        }
        if (jobId)
            initial(jobId);
    }, []);

    useEffect(() => {
        setLists(listDataByJobId?.listData?.length > 0 ? listDataByJobId?.listData : [])
    }, [listDataByJobId]);

    const handleShowListNamePopup = () => {
        if (selectedCandidatesForList?.length === 0) {
            toast("Please select candidates first")
            return
        }
        handlePopupCenterComponentRender(<ListNamePopup selectedCandidatesForList={selectedCandidatesForList} uncheckBoxes={uncheckBoxesFunc} />)
        handlePopupCenterOpen(true)
    }

    const uncheckBoxesFunc = (data) => {
        setUncheckBoxes(data);
    }

    const handleOnChange = (e) => {
    }

    const handleDataFromConfigureView = (data) => {
        setDataFromConfigureView(data);
        if (data.email) {
            setEmail(data?.email)
        }
        if (data.expiryDate) {
            setExpiryDate(data?.expiryDate);
        }
        if (data.passcode) {
            setPasscode(data?.passcode);
            setIsShareByEmail(data?.isShareByEmail ? true : false);
        }
        if (data.visits) {
            setVisits(data?.visits?.target.value);
        }
        if (data.sharedTo) {
            setSharedTo(data?.sharedTo);
        }
        if (data.isShowAnalytics) {
            setIsShowAnalytics(data?.isShowAnalytics?.target.checked);
        }
        if (data.isWaterMarkAdded) {
            setIsWaterMarkAdded(data?.isWaterMarkAdded?.target.checked)
        }
    }

    const setConfiguration = async () => {
        const finalSharedTo = sharedTo && sharedTo.length > 0
            ? sharedTo
            : email?.map((item) => ({
                "email": item,
                "expiryDate": expiryDate,
                "isAuthorized": true,
            })) || [];

        const data = {
            "passcode": passcode,
            "isShareByEmail": isShareByEmail,
            "totalVisit": visits,
            "sharedTo": finalSharedTo,
            "isWaterMarkAdded": isWaterMarkAdded,
            "isShowAnalytics": isShowAnalytics,
            "numberOfVists": 0
        };
        if (finalSharedTo.length <= 0)
            return toast.error('Recipient email is required!');

        if (!passcode)
            return toast.error('Passcode is required!');

        await handleSetConfiguration(listId, data);
    }

    return (
        <>
            {configureView ? <div className={styles.Wrapper}>
                <div className={styles.HeadingWrapper}>
                    <h2 className={styles.Heading}>
                        {" "}Configure
                        <span className="text-gray-400 font-100 ">
                            {" "}
                            <span className={styles.Dot}>.</span> {''}
                        </span>{" "}
                    </h2>
                    <Close className={styles.Close} onClick={handleClose} />
                </div>
                <ConfigureView handleOnChange={handleOnChange} listId={listId} dataFromConfigureView={handleDataFromConfigureView} listDetails={listDetails} />
                {/* <ConfigureView dataFromConfigureView={handleDataFromConfigureView} /> */}
                <div className={styles.BottomBtnsWrapper}>
                    <Button
                        text={"Send email"}
                        btnType={"primary"}
                        className={styles.BtnClass}
                        onClick={setConfiguration}
                    />
                </div>

            </div>
                : <div className={styles.Wrapper}>
                    <div className={styles.HeadingWrapper}>
                        <h2 className={styles.Heading}>
                            Manage list{" "}
                            <span className="text-gray-400 font-100 ">
                                {" "}
                                {/* <span className={styles.Dot}>.</span> {''} */}
                            </span>{" "}
                        </h2>
                        <Close className={styles.Close} onClick={handleClose} />
                    </div>
                    <div>
                        <div className={styles.InputWrapper}>
                            <div className={styles.CreatePodTextWrapper}>
                                <span className={styles.Subheading}>Select a list</span>
                                <span className={styles.CreatePod} onClick={handleShowListNamePopup}>
                                    + Create list
                                </span>
                            </div>
                            <div className={styles.inputIcons}>
                                <i className={`fa fa-search ${styles.icon}`}></i>
                                <CustomInput
                                    placeholder={"Search"}
                                    className={styles.inputField}
                                    onChange={(e) => setListSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.PodCardWrapper}>
                        {/* {lists?.map((item) => {
                            return <ListCard setConfigureView={setConfigureView} list={item} />
                        })} */}
                        {
                            lists?.filter(item => item?.listName?.toLowerCase().includes(listSearch?.toLowerCase()))?.map((item) => {
                                return <ListCard key={item?.id} setConfigureView={setConfigureView} setListId={setListId} list={item} jobId={jobId} setListDetails={setListDetails} />
                            })
                        }

                    </div>
                    {/* <div className={styles.BottomBtnsWrapper}>
                        <Button
                            text={"Save"}
                            btnType={"primary"}
                            className={styles.BtnClass}

                        />
                    </div> */}
                </div>}
        </>
    );
};

export default ManageListComponent;
