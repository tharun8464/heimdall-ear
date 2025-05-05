import CandidateEvaluationDashboard from "../CandidateEvaluationDashboard/CandidateEvaluationDashboard";
import styles from "./EvaluationReportsComponent.module.css";
import ReportComponent from "./ReportComponent/ReportComponent";

const EvaluationReportsComponent = () => {
  return (
    <div className={styles.Wrapper}>
      <CandidateEvaluationDashboard showTableHeader={false} />
      <ReportComponent />
    </div>
  );
};

export default EvaluationReportsComponent;
