import styles from "./HeimdallBaselineInfo.module.css";
import React, { useEffect, useState } from "react";
import { browserName } from "react-device-detect";
import {
  getInterviewApplication,
  getBaseLiningImagesFace,
  getBaseLiningImagesPerson,
  getBaseLiningImagesEar,
  getBaseLiningImagesGaze,
} from "../../../../../../service/api";
import { getStorage, getSessionStorage } from "../../../../../../service/storageService";

const HeimdallBaselineInfo = ({ ratingsData , interviewId }) => {


  const filteredData = {};
  const propertiesToExtract = ["earTest", "faceTest", "facedCamera", "personTest"];

  // Loop through the properties and extract the desired ones
  propertiesToExtract.forEach(property => {
    if (ratingsData?.hasOwnProperty(property)) {
      filteredData[property] = ratingsData[property];
    }
  });


  const mappedData = Object.entries(filteredData).map(([property, value]) => ({
    property: property,
    status: value ? "detected" : "not detected",
    style: {
      color: value ? 'text-green-500' : 'text-[#D6615A]',
      font: 'font-normal',
    },
  }));


  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [evaluated, setevaluated] = useState(null);
  const [preinterviewImages, setPreinterviewImages] = useState([]);

  useEffect(() => {
    const gia = async () => {
      let res = await getInterviewApplication({ id: interviewId });
      const { application } = res.data.data;
      getBaseLiningImagesData(application);
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


  const getBaseLiningImagesData = async (applicationData) => {
    let data = { id: applicationData._id };
    const images = [];
    const faceDataResponse = await getBaseLiningImagesFace(data);
    if (faceDataResponse.status === 200) {
      images.push(faceDataResponse.data.image);
    }
    const personDataResponse = await getBaseLiningImagesPerson(data);

    if (personDataResponse.status === 200) {
      images.push(personDataResponse.data.image);
    }
    const earDataResponse = await getBaseLiningImagesEar(data);
    if (earDataResponse.status === 200) {
      images.push(earDataResponse.data.image);
    }
    const gazeDataResponse = await getBaseLiningImagesGaze(data);
    if (gazeDataResponse.status === 200) {
      images.push(gazeDataResponse.data.image);
    }
    setPreinterviewImages(images);
  }

  let leftEyeBlinkRate, faceTest, earpieceDetectionStatus, personTest;

  if (application) {
    faceTest = evaluated.faceTest;
    earpieceDetectionStatus = evaluated.earTest;
    personTest = evaluated.personTest;
    leftEyeBlinkRate = application.leftEyeBlinkRate * 10;
    if (parseFloat(leftEyeBlinkRate.toFixed(2)) > 4) leftEyeBlinkRate = "High";
    else if (parseFloat(leftEyeBlinkRate.toFixed(2)) < 2.8)
      leftEyeBlinkRate = "Low";
    else leftEyeBlinkRate = "Medium";

  }



  //console.log("pearce", mappedData)
  return (
    <div className={styles.Wrapper}>
      <h2 className={styles.Heading}>Heimdall Baseline as per candidate</h2>
      <div>
        <table className={styles.Table}>
          <tbody>
            {mappedData.map(({ property, status, style }) => {
              return (
                <tr>
                  <td className={styles.FontWeight600}>{(property === "earTest") ? "Earpiece" :
                    (property === "faceTest") ? "Face Detection" :
                      (property === "facedCamera") ? "Gaze Detection" :
                        (property === "personTest") ? "Extra Person" : "Should Be Added in UI"} </td>

                  {/* <td className={styles.FontWeight600}>{property}</td> */}
                  <td className={`${styles.TextAlignRight} ${style.color} ${style.font}`}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeimdallBaselineInfo;
