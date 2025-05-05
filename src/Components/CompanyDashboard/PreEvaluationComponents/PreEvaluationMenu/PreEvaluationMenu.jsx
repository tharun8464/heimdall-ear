import { IoIosArrowBack } from "react-icons/io";
import { AiFillLock, AiOutlinePlus } from "react-icons/ai";
import styles from "./PreEvaluationMenu.module.css";
import { useNavigate } from "react-router";
import Button from "../../../Button/Button";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ShareIcon from '@mui/icons-material/Share';
import usePopup from "../../../../Hooks/usePopup";
import ListNamePopup from "./ListNamePopup/ListNamePopup";
import Analytics from "../../../../Pages/AdminDashboard/Analytics/Analytics";
import ReportsCheckboxPopup from "../../../../Pages/AdminDashboard/ReportsCheckboxPopup/ReportsCheckboxPopup";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useList from "../../../../Hooks/useList";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const PreEvaluationMenu = ({ viewType, setViewType, setShowAddCandidate, handleTabChange, selectedCandidatesForList, manageListShare, setManageListShare, uncheckBoxes }) => {
  const navigate = useNavigate();
  const { handlePopupCenterComponentRender, handlePopupCenterOpen } = usePopup()
  const { id: jobId } = useParams();
  const [reportShare, setReportShare] = useState(false)
  const { handleGetListByJobId } = useList();
  const { listDataByJobId } = useSelector(state => state.list);

  useEffect(() => {
    const initial = async () => {
      await handleGetListByJobId(jobId)
    }
    initial();
  }, []);

  const uncheckBoxesFunc = (data) => {
    if (data === 'uncheckAllBoxes') {
      handleViewType("main")
      toast("List created successfully!")
    }
  }

  useEffect(() => {
    if (uncheckBoxes === 'uncheckAllBoxes') {
      handleViewType("main")
      toast("List created successfully!")
    }
  })

  const handleViewType = (viewType) => {
    setViewType(viewType);
    handleTabChange(viewType);
  };

  const handleShowAddCandidate = () => {
    setShowAddCandidate(true);
  };


  const handleNavigate = () => {
    navigate("/company/jobs");
  };

  const handleShowListNamePopup = () => {
    if (selectedCandidatesForList?.length === 0) {
      toast("Please select candidates first")
      return
    }
    handlePopupCenterOpen(true)
    handlePopupCenterComponentRender(<ListNamePopup selectedCandidatesForList={selectedCandidatesForList} uncheckBoxes={uncheckBoxesFunc} />)
  }
  const handleAnalytics = () => {
    if (listDataByJobId?.listData?.length > 0) {
      handlePopupCenterOpen(true)
      handlePopupCenterComponentRender(<Analytics jobId={jobId} />)
    }
    // handlePopupCenterComponentRender(<AnalyticsPopup />)
  }

  const handleShareReports = () => {
    // handlePopupCenterOpen(true)
    // handlePopupCenterComponentRender(<ReportsCheckboxPopup />)
    // setReportShare(prevState => (!prevState))
    setManageListShare(true);
  }

  // const handleReportCheckboxEditing = (ev) => {
  //   if (ev === 'click') setReportShare(false);
  // }
  return (
    <div className={`${styles.Wrapper}`}>
      <div
        className={` ${styles.BackBtnWrapper} flex flex-row`}
        onClick={handleNavigate}
      >
        <IoIosArrowBack className="m-auto" />
        <div className="m-auto">Back</div>
      </div>
      <div
        className={` ${styles.TabsWrapper
          } flex flex-row gap-4 bg-[#EEEEEE] rounded-xl ${viewType === "main" ? "" : styles.LeftPadding
          } ${viewType === "team" ? "" : styles.RightPadding} `}
      >
        <div
          className={
            viewType === "main"
              ? `rounded-xl bg-[#FFFFFF] px-2 flex ${styles.ActiveTab}`
              : "flex"
          }
          onClick={() => handleViewType("main")}
        >
          <div className="flex m-auto">Main view</div>
        </div>
        <div
          className={
            viewType === "tag"
              ? `rounded-xl bg-[#FFFFFF] px-2 flex ${styles.ActiveTab}`
              : "flex"
          }
          onClick={() => handleViewType("tag")}
        >
          <div className="flex m-auto">Tag view</div>
        </div>
        <div
          className={
            viewType === "team"
              ? `rounded-xl bg-[#FFFFFF] px-2 flex ${styles.ActiveTab}`
              : "flex"
          }
          onClick={() => handleViewType("team")}
        >
          {/* <AiFillLock className="m-auto" /> */}
          <div className="flex m-auto">Team Dynamics</div>
        </div>
      </div>
      <div className="flex gap-4 items-center">

        {viewType === "main" && (
          <Button icon={<SignalCellularAltIcon />} btnType={'secondary'} className={'px-2 py-1'} onClick={handleAnalytics} />
        )}
        {viewType === "main" && (
          <Button icon={<ShareIcon />} btnType={'secondary'} className={'px-2 py-1'} onClick={handleShareReports} />
        )}
        {reportShare ? <ReportsCheckboxPopup /> : ""}
        <div className="">
          {viewType === "main" && (
            <Button btnType={'primary'} text={'+ List'} onClick={handleShowListNamePopup} />
          )}
        </div>
        <button
          type="submit"
          className={` ${styles.AddCandidateBtn} focus:outline-none w-fit flex justify-between gap-2 cursor-pointer border border-solid border-[#E3E3E3] rounded-lg bg-[#228276]`}
        >
          <div className="flex justify-center h-[27px] py-1">
            <AiOutlinePlus className="text-[#FFFFFF] h-full" />
          </div>
          <div
            className="text-[#FFFFFF] text-sm self-center"
            onClick={handleShowAddCandidate}
          >
            Add Candidates
          </div>
        </button>
      </div>
    </div>
  );
};

export default PreEvaluationMenu;
