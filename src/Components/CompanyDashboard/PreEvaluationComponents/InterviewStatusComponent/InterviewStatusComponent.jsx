import { Close } from "@mui/icons-material";
import { Doughnut } from "react-chartjs-2";

import styles from "./InterviewStatusComponent.module.css";
import usePreEvaluation from "../../../../Hooks/usePreEvaluation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const InterviewStatusComponent = ({ setShowInterviewStatus, jobId }) => {
  const { handleGetInterviewStatuses } = usePreEvaluation();
  const { interviewStatuses } = useSelector((state) => state.preEvaluation);

  const handleClose = () => {
    setShowInterviewStatus(false);
  };

  const options = {
    cutout: 50,
  };

  const data = {
    // labels: ["Red"],
    datasets: [
      {
        // label: "# of Votes",
        data: [10, 10],
        backgroundColor: ["rgba(34, 130, 118, 1)", "#eee"],
        // borderColor: [
        //   "rgba(255, 99, 132, 1)",
        //   "rgba(54, 162, 235, 1)",
        //   "rgba(255, 206, 86, 1)",
        //   "rgba(75, 192, 192, 1)",
        //   "rgba(153, 102, 255, 1)",
        //   "rgba(255, 159, 64, 1)",
        // ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    handleGetInterviewStatuses(jobId);
  }, [jobId]);

  return (
    <div className={styles.Wrapper}>
      <div className={styles.HeadingWrapper}>
        <h2 className={styles.Heading}>Add candidates to shortlist</h2>
        <Close className={styles.Close} onClick={handleClose} />
      </div>
      <div className={styles.StatsComponent}>
        <div className="flex gap-2 items-center">
          <span>Interviewed candidates</span>
          <span className={styles.SubHeading}>
            {interviewStatuses?.data?.xiRecommended +
              interviewStatuses?.data?.xiNotRecommended}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <span>Hired</span>
          <span className={styles.SubHeading}>
            {interviewStatuses?.data?.xiRecommended}
          </span>
        </div>
      </div>
      <div className={styles.AllgraphWrapper}>
        <div className={styles.StatWrapper}>
          <span className={styles.GraphHeading}>In-process</span>
          <div className={styles.GraphWrapper}>
            <span className={styles.StatNumber}>
              {interviewStatuses?.data?.inprocess}
            </span>
            <Doughnut data={data} options={options} />
          </div>
        </div>
        <div className={styles.StatWrapper}>
          <span className={styles.GraphHeading}>Xi Recommended</span>
          <div className={styles.GraphWrapper}>
            <span className={styles.StatNumber}>
              {interviewStatuses?.data?.xiRecommended}
            </span>
            <Doughnut data={data} options={options} />
          </div>
        </div>
        <div className={styles.StatWrapper}>
          <span className={styles.GraphHeading}>Xi not Recommended</span>
          <div className={styles.GraphWrapper}>
            <span className={styles.StatNumber}>
              {interviewStatuses?.data?.xiNotRecommended}
            </span>
            <Doughnut data={data} options={options} />
          </div>
        </div>
        <div className={styles.StatWrapper}>
          <span className={styles.GraphHeading}>No-show</span>
          <div className={styles.GraphWrapper}>
            <span className={styles.StatNumber}>
              {interviewStatuses?.data?.noshow}
            </span>
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewStatusComponent;
