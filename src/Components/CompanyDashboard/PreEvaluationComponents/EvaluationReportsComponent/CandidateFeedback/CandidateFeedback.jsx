import styles from "./CandidateFeedback.module.css";
import StarIcon from "@mui/icons-material/Star";
import React, { useEffect, useState } from "react";
import {getInterviewApplication,} from "../../../../../service/api";
import { getStorage } from "../../../../../service/storageService";

const CandidateFeedback = ({candidateFeedback}) => {
//console.log("candidate",candidateFeedback)

  return (
    <div className={styles.Wrapper}>
      <div className={styles.RatingWrapper}>
        <h2 className={styles.Heading}>Candidate Feedback</h2>
        <div>
          {candidateFeedback ? (
            <>
              {candidateFeedback?.candidate_rating > 0 ? ( <StarIcon sx={{ color: "var(--primary-green)" }} />) : (<StarIcon sx={{ color: "var(--primary-grey)" }} />)}
              {candidateFeedback?.candidate_rating > 1 ? ( <StarIcon sx={{ color: "var(--primary-green)" }} />) : (<StarIcon sx={{ color: "var(--primary-grey)" }} />)}
              {candidateFeedback?.candidate_rating > 2 ? ( <StarIcon sx={{ color: "var(--primary-green)" }} />) : (<StarIcon sx={{ color: "var(--primary-grey)" }} />)}
              {candidateFeedback?.candidate_rating > 3 ? ( <StarIcon sx={{ color: "var(--primary-green)" }} />) : (<StarIcon sx={{ color: "var(--primary-grey)" }} />)}
              {candidateFeedback?.candidate_rating > 4 ? ( <StarIcon sx={{ color: "var(--primary-green)" }} />) : (<StarIcon sx={{ color: "var(--primary-grey)" }} />)}
            </>
          ) : null}
        </div>
      </div>
      <span>
        {candidateFeedback && candidateFeedback?.feedback
          ? (<i>{candidateFeedback?.feedback}</i>)
          : (<i> </i>)
        }
      </span>
    </div>
  );
};

export default CandidateFeedback;
