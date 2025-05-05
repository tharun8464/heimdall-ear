import CandidateFeedback from "../CandidateFeedback/CandidateFeedback";
import CandidatePersonalityComponent from "./CandidatePersonalityComponent/CandidatePersonalityComponent";
import CandidateRatingComponent from "./CandidateRatingComponent/CandidateRatingComponent";
import styles from "./FeedbackReport.module.css";
import HeimdallBaselineInfo from "./HeimdallBaselineInfo/HeimdallBaselineInfo";
import InterviewerNotesComponent from "./InterviewerNotesComponent/InterviewerNotesComponent";
import LibraryComponent from "./LibraryComponent/LibraryComponent";
import TechnicalAssesmentComponent from "./TechnicalAssessmentComponent/TechnicalAssesmentComponent";

const FeedbackReport = ({ feedbacksData, reportRef, interviewRecordingRef }) => {

  const intId = feedbacksData?.data?.interviewID

  const ratingsData = feedbacksData?.data?.evaluations

  const interviewId = feedbacksData?.data?.interviewID

  const whiteBoard = feedbacksData?.data?.whiteboard
  const codeArea = feedbacksData?.data?.codearea
  const candidateFeedback = feedbacksData?.data?.candidateFeedback
  const meetingLink = feedbacksData?.data?.meetingId
  // console.log("feeding",ratingsData)
  return (
    <div id="feedback-report-node" className={styles.Wrapper} ref={reportRef}>
      {ratingsData ? (
        <>

          <CandidateRatingComponent ratingsData={ratingsData} />
          <HeimdallBaselineInfo ratingsData={ratingsData} interviewId={interviewId} />
          <InterviewerNotesComponent ratingsData={ratingsData} interviewId={interviewId} />
          <CandidatePersonalityComponent meetingLink={meetingLink} intId={intId} />
          <LibraryComponent intId={intId} interviewRecordingRef={interviewRecordingRef} />
          <TechnicalAssesmentComponent whiteBoard={whiteBoard} codeArea={codeArea} />
          <CandidateFeedback candidateFeedback={candidateFeedback} />
        </>

      ) : (
        <div className={styles.NoReportsMessage}>
          <p>No reports available.</p>
        </div>
      )}
    </div>
  );
};


export default FeedbackReport;
