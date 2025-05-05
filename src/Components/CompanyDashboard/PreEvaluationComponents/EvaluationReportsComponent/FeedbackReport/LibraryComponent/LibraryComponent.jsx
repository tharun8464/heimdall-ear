import styles from "./LibraryComponent.module.css";
import DemoLibraryImg from "../../../../../../assets/images/Reports/DemoLibraryImg.png";

import React, { useEffect, useState } from "react";
import {
  getInterviewApplication,
  getBaseLiningImagesFace,
  getBaseLiningImagesPerson,
  getBaseLiningImagesEar,
  getBaseLiningImagesGaze,
  getRecordingsURL
} from "../../../../../../service/api";
import { getStorage, getSessionStorage } from "../../../../../../service/storageService";
import { ApplicationList } from "twilio/lib/rest/api/v2010/account/application";

// const preinterviewImages = [
//   DemoLibraryImg,
//   DemoLibraryImg,
//   DemoLibraryImg,
//   DemoLibraryImg,
//   DemoLibraryImg,
//   DemoLibraryImg,
//   DemoLibraryImg,
// ];

// const recordingURLS = [
//   'https://example.com/video1.mp4',
//   'https://example.com/video2.mp4',
//   'https://example.com/video3.mp4',
// ];


const LibraryComponent = ({ intId, interviewRecordingRef }) => {
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [recordingURLS, setRecordingURLS] = useState([]);
  const [preinterviewImages, setPreinterviewImages] = useState([]);



  useEffect(() => {
    const gia = async (usr) => {
      setRecordingURLS([]);
      let res = await getInterviewApplication({ id: intId });
      const { applicant, application, job } = res.data.data;
      const recordingURLS = res?.data?.recordingsURL;
      // console.log("imag", application)
      setRecordingURLS(recordingURLS);
      getBaseLiningImagesData(application);
      setApplication(application);
      setApplicant(applicant);
    };
    const getuserdata = async () => {
      let user = JSON.parse(await getSessionStorage("user"));
      setUser(user);
      gia(user);
    };
    getuserdata();
  }, []);

  const getBaseLiningImagesData = async (applicationData) => {
    let data = { id: intId };
    const images = [];

    const faceDataResponse = await getBaseLiningImagesFace(data);

    if (faceDataResponse.status === 200) {
      images.push(faceDataResponse.data.image);
    }
    const personDataResponse = await getBaseLiningImagesPerson(data);
    // console.log("ima", personDataResponse)
    if (personDataResponse.status === 200) {
      images.push(personDataResponse.data.image);
    }
    const earDataResponse = await getBaseLiningImagesEar(data);
    // console.log("fetch", earDataResponse)
    if (earDataResponse.status === 200) {
      images.push(earDataResponse.data.image);
    }
    const gazeDataResponse = await getBaseLiningImagesGaze(data);

    if (gazeDataResponse.status === 200) {
      images.push(gazeDataResponse.data.image);
    }

    setPreinterviewImages(images);

  }

  return (
    <div className={styles.Wrapper}>
      <h2 className={styles.MainHeading}>Library</h2>
      <div ref={interviewRecordingRef}>
        <h2 className={styles.Heading}>Interview recordings</h2>
        <div className=" flex mt-2 overflow-x-auto max-w-[300] mx-auto">
          {recordingURLS.length > 0 ? (
            <div className="flex space-x-4">
              {
                recordingURLS.map((url) => {
                  return (
                    <video controls width="240" height="120">
                      <source src={url.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )
                })
              }
            </div>
          ) : (
            <>
              <p className="relative flex w-full justify-center my-4">Sorry, there are no recordings available</p>
            </>
          )}
        </div>
      </div>
      <div>
        <h2 className={styles.Heading}>Pre-interview images</h2>
        <div className=" flex mt-2 overflow-x-auto max-w-[300] mx-auto">

          {preinterviewImages.length > 0 ? (
            <div className="flex space-x-4">
              {
                preinterviewImages.map((value) => {
                  return (
                    <img src={value} alt="" className={styles.Img} />
                  )
                })
              }
            </div>
          ) : (
            <>
              <p className="relative flex w-full justify-center my-4">Sorry, there are no images available</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryComponent;
