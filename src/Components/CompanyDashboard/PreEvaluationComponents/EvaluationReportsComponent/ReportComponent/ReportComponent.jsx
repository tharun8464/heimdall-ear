import PercentageComponent from "../PercentageComponent/PercentageComponent";
import ReportHeaderComponent from "../ReportHeaderComponent/ReportHeaderComponent";
import styles from "./ReportComponent.module.css";
import office_avatar from "../../../../../assets/images/officeavatar.png";
import CultureMatchComponent from "./CultureMatchComponent/CultureMatchComponent";
import GeneralInsightComponent from "./GeneralInsightComponent/GeneralInsightComponent";
import CompetitorMatch from "./CompetitorMatch/CompetitorMatch";
import PersonalityInsights from "./PersonalityInsights/PersonalityInsights";
import { useEffect, useState, useRef } from "react";
import FeedbackReport from "../FeedbackReport/FeedbackReport";
import useReport from "../../../../../Hooks/useReport";
import usePreEvaluation from "../../../../../Hooks/usePreEvaluation";
import { useSelector } from "react-redux";
import CognitiveAnalysis from "./CognitiveAnalysis/CognitiveAnalysis";
import getStorage, { getSessionStorage } from "../../../../../service/storageService";
import { useParams } from "react-router";
import { getJobById } from "../../../../../service/api";
import { notify } from "../../../../../utils/notify";
import TeamCompatibilityComponent from "../../../../TeamCompatibilityComponent/TeamCompatibilityComponent";
import html2pdf from "html2pdf.js";

const ReportComponent = ({
  selectedCandidate,
  handleSectionClose,
  handleTagChange,
  isMainView,
  setIsOnClickTagView,
}) => {
  const chipsData = [
    { title: "Good Fit", type: "success" },
    { title: "Good Fit", type: "success" },
    { title: "Good Fit", type: "success" },
  ];
  // **************
  const { mainViewProfiles, isGetMainViewProfilesLoading, mainViewProf } =
    useSelector(state => state.preEvaluation);

  // **************

  const reportRef = useRef();
  const [user, setUser] = useState();
  const [job, setJob] = useState();
  const [cult, setCult] = useState();
  const {
    handleGetPsychDetails,
    handleGetCultDetails,
    handleGetVmPro,
    handleGetFeedback,
  } = useReport();
  const {
    handleGetCompanyNameById,
  } = usePreEvaluation();

  const { psychDetailsData } = useSelector((state) => state.report);
  const { cultDetailsData } = useSelector((state) => state.report);
  const { feedbacksData } = useSelector((state) => state.report);
  const { vmProData } = useSelector((state) => state.report);
  const { bestProfiles, companyName } = useSelector(
    (state) => state.preEvaluation
  );


  const interviewRecordingRef = useRef()

  const [reportType, setReportType] = useState(() => {
    if (selectedCandidate?.hasVmLiteReport) {
      return "lite";
    } else if (selectedCandidate?.hasFeedback) {
      return "feedback";
    } else if (selectedCandidate?.hasTeamDynamicReport) {
      return "dynamics";
    } else if (selectedCandidate?.hasVMProReport) {
      return "pro";
    } else {
      return "none";
    }
  });

  useEffect(() => {
    // Reset reportType when selectedCandidate changes
    setReportType(() => {
      if (selectedCandidate?.hasVmLiteReport) {
        return "lite";
      } else if (selectedCandidate?.hasVMProReport) {
        return "pro";
      } else if (selectedCandidate?.hasFeedback) {
        return "feedback";
      } else if (selectedCandidate?.hasTeamDynamicReport) {
        return "dynamics";
      } else {
        return "none";
      }
    });
  }, [selectedCandidate]);

  const { id: jobId } = useParams();

  const getUser = async () => {
    let user = await JSON.parse(getSessionStorage("user"));
    setUser(user);
  };

  const downloadPDF = () => {
    const element = reportRef.current;
    if (!element) return;
    const originalHeight = element.style.height;
    element.style.height = "auto"; // Temporarily set height to auto to capture full content


    const interviewRecordingElement = interviewRecordingRef.current
    if (interviewRecordingElement) {
      interviewRecordingElement.style.display = 'none'
    }

    const reportMapping = {
      dynamics: "Team Dynamics",
      lite: "VmLite",
      pro: "VmPro",
      feedback: "Feedback"
    }


    const opt = {
      margin: [15, 15],
      filename: `${selectedCandidate?.firstName}_${selectedCandidate?.lastName}_${reportMapping[reportType]}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true },
      jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().from(element).set(opt).toPdf().get('pdf').then((pdf) => {

      var totalPages = pdf.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text('copyright@valuematrix', pdf.internal.pageSize.getWidth() - 105, pdf.internal.pageSize.getHeight() - 8);
      }

    }).save().then(() => {
      element.style.height = originalHeight;
      if (interviewRecordingElement) {
        interviewRecordingElement.style.display = 'block'
      }

    }).catch((error) => {
      console.error("Error generating PDF:", error);
      element.style.height = originalHeight;
      if (interviewRecordingElement) {
        interviewRecordingElement.style.display = 'block'
      }

    });
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user?.company_id) {
      handleGetCompanyNameById(user?.company_id);
    }
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let access_token = getStorage("access_token");
      let res = await getJobById(jobId, access_token);
      if (res) {
        setJob(res.data.job);
      } else {
        notify(`Tokin Expired please login again`, "error");
      }
    };
    getData();
  }, [jobId]);


  useEffect(() => {
    const data = {
      profileURL: isMainView
        ? selectedCandidate?.linkedinUrl
        : selectedCandidate.profileURL,
    };

    handleGetPsychDetails(data);

  }, [selectedCandidate, isMainView, jobId]);

  useEffect(() => {
    if (user) {
      const data = {
        linkedinURL: isMainView
          ? selectedCandidate?.linkedinUrl
          : selectedCandidate.profileURL,
        firstName: selectedCandidate.firstName,
        jobId: jobId,
      };

      handleGetVmPro(data);
    }
  }, [jobId, isMainView, selectedCandidate, user]);

  useEffect(() => {
    try {

      const data = {
        organizationID: user?.company_id,
        profileID: isMainView
          ? selectedCandidate?.indiProfileId
          : selectedCandidate?.mProfileId,
      };

      handleGetCultDetails(data);
      setCult(data);
    } catch (error) {
      console.error("Error fetching data for cult:", error);
    }
  }, [user, selectedCandidate]);

  useEffect(() => {
    const data = {
      email: selectedCandidate?.email,
    };

    handleGetFeedback(data, jobId);
  }, [selectedCandidate]);

  const { profile } = psychDetailsData ?? {};

  const { Data } = cultDetailsData ?? {};

  const { vmReport } = vmProData ?? {};

  const totalScore = Data?.ConfidenceScoreOrganization;
  const integerTotalScore = totalScore ? Math.round(totalScore) : null;

  const orgScore = Data?.FlippedMatchPercentage;


  switch (reportType) {
    case "lite":
      return (
        <div className={styles.Wrapper}>
          <ReportHeaderComponent
            chipsData={chipsData}
            setReportType={setReportType}
            reportType={reportType}
            selectedCandidate={selectedCandidate}
            handleSectionClose={handleSectionClose}
            handleTagChange={handleTagChange}
            isReportView={true}
            isMainView={isMainView}
            setIsOnClickTagView={setIsOnClickTagView}
            downloadReport={downloadPDF}
            organizationID={user?.company_id}
          />
          {mainViewProfiles?.map((item, index) => {
            if (selectedCandidate.email == item.email) {

              {
                return (selectedCandidate.hasVmLiteReport && item.culturalMatch) ? (


                  <div id="lite-report-node" ref={reportRef} className={`${styles.ReportComponentsWrapper} avoid-page-break`}>
                    <div className={`bg-white p-2 rounded-lg avoid-page-break`}>
                      <h2 className={styles.Heading}>
                        Current organisation vs. {companyName?.companyName}
                      </h2>
                      <div className={styles.PercentageWrapper}>
                        <PercentageComponent
                          title={profile?.currentCompany}
                          percentage={selectedCandidate?.culturalMatch?.ConfidenceScoreCandidate}
                          logoSrc={office_avatar}
                        />
                        <PercentageComponent
                          title={companyName?.companyName}
                          percentage={Math.floor(cultDetailsData?.data?.conf * 100)}
                          logoSrc={companyName?.companyImage ? companyName?.companyImage : office_avatar}
                        />
                      </div>
                    </div>

                    <CultureMatchComponent
                      cultDetailsData={cultDetailsData ?? {}}
                      selectedCandidate={selectedCandidate}
                      companyName={companyName?.companyName}
                      jobTitle={job?.jobTitle}
                      isMainView={isMainView}
                    />
                    <GeneralInsightComponent />
                    <PersonalityInsights vmReport={vmReport} />
                    <CompetitorMatch selectedCandidate={selectedCandidate} isMainView={isMainView} competitors={companyName?.companyCompetitors} organizationID={user?.company_id} />
                  </div>

                ) :
                  (<div className="items-center flex justify-center">
                    {" "}
                    No reports available for {selectedCandidate?.firstName}{" "}
                    {selectedCandidate?.lastName}
                  </div>)
              }
            }

          })}



          {/* ************ */}
        </div>
      );
    case "dynamics":
      return (
        <div className={styles.Wrapper}>
          <ReportHeaderComponent
            selectedCandidate={selectedCandidate}
            chipsData={chipsData}
            isMainView={isMainView}
            setReportType={setReportType}
            reportType={reportType}
            handleTagChange={handleTagChange}
            isReportView={true}
            setIsOnClickTagView={setIsOnClickTagView}
            handleSectionClose={handleSectionClose}
            downloadReport={downloadPDF}
            organizationID={user?.company_id}
          />
          <TeamCompatibilityComponent
            isTeam={true}
            setCandidate={selectedCandidate}
            candidateProfiles={bestProfiles?.data}
            jobId={jobId}
            reportRef={reportRef}
          />
        </div>

      );
    case "pro":
      return (
        <div className={styles.Wrapper}>
          <ReportHeaderComponent
            chipsData={chipsData}
            setReportType={setReportType}
            reportType={reportType}
            selectedCandidate={selectedCandidate}
            handleSectionClose={handleSectionClose}
            handleTagChange={handleTagChange}
            isReportView={true}
            isMainView={isMainView}
            setIsOnClickTagView={setIsOnClickTagView}
            downloadReport={downloadPDF}
            organizationID={user?.company_id}
          />
          <div id="pro-report-node" ref={reportRef} className={`${styles.ReportComponentsWrapper} avoid-page-break`}>
            <div className={`"bg-white p-2 rounded-lg " avoid-page-break`}>
              <h2 className={styles.Heading}>
                Current organisation vs. {companyName?.companyName}
              </h2>
              <div className={styles.PercentageWrapper}>
                <PercentageComponent
                  title={profile?.currentCompany}
                  percentage={integerTotalScore}
                  logoSrc={office_avatar}
                />
                <PercentageComponent
                  title={companyName?.companyName}
                  percentage={orgScore}
                  logoSrc={companyName?.companyImage ? companyName?.companyImage : office_avatar}
                />
              </div>
            </div>

            <CultureMatchComponent
              cultDetailsData={cultDetailsData ?? {}}
              selectedCandidate={selectedCandidate}
              jobTitle={job?.jobTitle}
              companyName={companyName?.companyName}
            />
            <GeneralInsightComponent />
            <PersonalityInsights vmReport={vmReport} />
            <CompetitorMatch selectedCandidate={selectedCandidate} isMainView={isMainView} competitors={companyName?.companyCompetitors} organizationID={user?.company_id} />
            <CognitiveAnalysis vmReport={vmReport} />
          </div>
        </div>
      );
    case "feedback":
      return (
        <div className={styles.Wrapper}>
          <ReportHeaderComponent
            chipsData={chipsData}
            setReportType={setReportType}
            reportType={reportType}
            selectedCandidate={selectedCandidate}
            handleSectionClose={handleSectionClose}
            handleTagChange={handleTagChange}
            isReportView={true}
            isMainView={isMainView}
            setIsOnClickTagView={setIsOnClickTagView}
            downloadReport={feedbacksData?.data?.evaluations ? downloadPDF : null}
            organizationID={user?.company_id}
          />
          <FeedbackReport feedbacksData={feedbacksData} reportRef={reportRef} interviewRecordingRef={interviewRecordingRef} />
        </div>
      );


    case "none":
      return (
        <div className={styles.Wrapper}>
          <ReportHeaderComponent
            chipsData={chipsData}
            setReportType={setReportType}
            reportType={reportType}
            selectedCandidate={selectedCandidate}
            handleSectionClose={handleSectionClose}
            handleTagChange={handleTagChange}
            isReportView={true}
            isMainView={isMainView}
            setIsOnClickTagView={setIsOnClickTagView}
            organizationID={user?.company_id}
          />
          <div className="items-center flex justify-center">
            {" "}
            No reports available for {selectedCandidate?.firstName}{" "}
            {selectedCandidate?.lastName}
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

export default ReportComponent;
