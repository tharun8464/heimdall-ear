import styles from "./InterviewerNotesComponent.module.css";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { getInterviewApplication, } from "../../../../../../service/api";
import { getStorage, getSessionStorage } from "../../../../../../service/storageService";

const InterviewerNotesComponent = ({ ratingsData , interviewId }) => {



  const [evaluated, setevaluated] = useState(null);
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  // 63c8f2640623cadd44c023ff
  useEffect(() => {
    const gia = async () => {
      let res = await getInterviewApplication({ id: interviewId });
      const { application } = res.data.data;
      setApplication(application);
      let interview = application.interviewers;
      setevaluated(application.evaluations[interview]);
    };

    const getuserdata = async () => {
      let user = JSON.parse(await getSessionStorage("user"));
      setUser(user);
      gia(user);
    };
    getuserdata();

  }, []);
  return (
    <div className={styles.Wrapper}>
      <h2 className={styles.MainHeading}>Interviewers Notes</h2>
      <div>
        <div className={styles.IconWrapper}>
          <h2 className={styles.Heading}>Positives</h2>
          <BsFillArrowUpCircleFill color="var(--primary-green)" />
        </div>
        <div className={styles.InfoWrapper}>
          <ul>
            {ratingsData?.positives.split('\n').map((point, index) => {
              // Remove leading/trailing whitespaces and filter out empty points
              const trimmedPoint = point.trim().replace(/^\d+\)\s*/, ''); // Remove numbers at the beginning
              return trimmedPoint && <li key={index} style={{ width: "100%", wordBreak: "break-all" }}>{trimmedPoint}</li>;
            })}
          </ul>
        </div>
      </div>
      <div>
        <div className={styles.IconWrapper}>
          <h2 className={styles.Heading}>Lowlights</h2>
          <BsFillArrowDownCircleFill color="var(--red-error)" />
        </div>
        <div className={styles.InfoWrapper}>
          <ul>
            {ratingsData?.lowlights.split('\n').map((point, index) => {
              // Remove leading/trailing whitespaces and filter out empty points
              const trimmedPoint = point.trim().replace(/^\d+\)\s*/, ''); // Remove numbers at the beginning
              return trimmedPoint && <li key={index} style={{ width: "100%", wordBreak: "break-all" }}  >{trimmedPoint}</li>;
            })}
          </ul>
        </div>
      </div>
      <div>
        <h2 className={styles.Heading}>Demeanour of the candidate </h2>
        <div className={styles.BackgroundGrey}>
          <span>{ratingsData?.demeanorOfCandidate}</span>
        </div>
      </div>
      <div>
        <h2 className={styles.Heading}>
          Was the candidate facing the camera for the entire session?
        </h2>
        <div className={styles.BackgroundGrey}>
          {/* <span>Yes</span> */}
          <span>
            {evaluated?.facedCamera ?
              <>The candidate was facing the camera for the entire session.</>
              :
              <>The candidate was not facing the camera for the entire session.</>
            }</span>
        </div>
      </div>
      <div>
        <h2 className={styles.Heading}>Interviewer feedback</h2>
        <div className={styles.BackgroundGrey} style={{ width: "100%", wordBreak: "break-all" }}>
          {ratingsData?.feedback}
        </div>
      </div>
    </div>
  );
};

export default InterviewerNotesComponent;
