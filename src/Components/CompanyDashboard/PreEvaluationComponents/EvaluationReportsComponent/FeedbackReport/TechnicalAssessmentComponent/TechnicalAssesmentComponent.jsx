import styles from "./TechnicalAssesmentComponent.module.css";
import React, { useEffect, useState } from "react";
import { getInterviewApplication } from "../../../../../../service/api";
import { getStorage } from "../../../../../../service/storageService";
import { Hidden } from "@mui/material";

const TechnicalAssesmentComponent = ({ whiteBoard, codeArea }) => {
  const [user, setUser] = useState(null);

  const [whiteBoardAreaImage, setWhiteBoardAreaImage] = React.useState("");




  return (
    <div className={styles.Wrapper}>
      <h2 className={styles.MainHeading}>Technical Assessment</h2>
      <div>
        <span className={styles.Heading}>Coding assessment</span>
        <div >
          {codeArea !== undefined && codeArea !== ""  ? (<strong>{atob(codeArea).split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}</strong>
          ) : (<strong>""</strong>)}
        </div>
      </div>
      <div>
        <span className={styles.Heading}>White board</span>
        <div>
          {whiteBoard !== "" ? (
            <img className="rounded-lg" src={whiteBoard} alt="" />)
            : (<img className="rounded-lg" src={""} alt="" />)
          }
        </div>
      </div>
    </div>
  );
};

export default TechnicalAssesmentComponent;
