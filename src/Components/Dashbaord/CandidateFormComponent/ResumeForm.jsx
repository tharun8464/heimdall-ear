import React from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  sovrenResumeParser,
  uploadCandidateResume,
} from "../../../service/api";

import Loader from "../../../assets/images/loader.gif";
import ls from 'localstorage-slim';
import { getStorage, setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../../service/storageService";

const ResumeForm = (props) => {
  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const handleChange = async (e) => {
    setLoading(true);
    setError(null);
    if (e.target && e.target.files) {
      let user = JSON.parse(await getSessionStorage("user"));
      let access_token = await getStorage("access_token");
      //console.log(user, " ", access_token);
      let fd = new FormData();
      fd.append("user_id", user._id);
      fd.append("file", e.target.files[0]);

      let response = await uploadCandidateResume(fd, access_token);
      if (response && response.status === 200) {
        //console.log(response);
        setSessionStorage("resumeInfo", JSON.stringify(response.data));
        await setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        setLoading(false);
        navigate('/user/editProfile')
        // window.location.href="user/editProfile"
        let res = await getSessionStorage("candidateDetails");
        res = JSON.parse(res);
        res.resume = e.target.files[0].name;
        setSessionStorage("candidateDetails", JSON.stringify(res));
      } else {
        setError("Error uploading file");
      }

      // var fileReader = new FileReader();
      // var base64;
      // // Onload of file read the file content
      // let base64String = "";
      // fileReader.onload = async function (fileLoadedEvent) {
      //   var modifiedDate = (new Date(fileLoadedEvent.lastModified)).toISOString().substring(0, 10);
      //   // base64 = Base64.encodeArray(fileLoadedEvent.target.result);
      //   base64 = fileLoadedEvent.target.result;
      //   base64String = base64;
      //   let resumeResponse = await sovrenResumeParser({
      //     DocumentAsBase64String: base64,
      //     SkillsSettings: {
      //       Normalize: false,
      //       TaxonomyVersion: "",
      //     },
      //     ProfessionsSettings: {
      //       Normalize: false,
      //     },
      //     DocumentLastModified : modifiedDate,
      //   });
      //   //console.log(resumeResponse);
      //   };
      //   await fileReader.readAsDataURL(e.target.files[0]);
      //   setLoading(false);
      //   e.target.files = null;
    }
  };

  React.useEffect(() => {
    const initial = async () => {
      let res = JSON.parse(await getSessionStorage("candidateDetails"));
      if (res && res.resume) {
        await setFileName(res.resume);
      }
    };
    initial();
  }, []);

  return (
    <div>
      <p className="font-bold text-lg">Upload Your Resume</p>
      {fileName && <p className="my-3">{fileName}</p>}
      {error && <p className="text-red-500 my-3">{error}</p>}
      <div className="my-5">
        {loading ? (
          <button className="py-1 px-3 bg-blue-500 rounded-md">
            <img src={Loader} className="h-7" alt="loader" />
          </button>
        ) : (
          <label
            for="resume"
            className="py-2 px-3 cursor-pointer bg-blue-500 rounded-md text-white"
            style={{ backgroundColor: "#034488" }}
          >
            {" "}
            Upload Resume{" "}
          </label>
        )}
        <input
          type="file"
          name="resume"
          className="hidden"
          id="resume"
          accept="application/pdf, application/msword"
          onChange={handleChange}
        />
      </div>
      <div className="w-full flex content-end">
        {loading && fileName === null ? (
          <button
            disabled={true}
            className={`px-3 py-2 ml-auto mr-3 bg-[#034388d7] text-white rounded-md`}
            style={{ backgroundColor: "#034377d7" }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => props.setStep(1)}
            className={`px-3 py-2 ml-auto mr-3 bg-[#034488] text-white rounded-md`}
            style={{ backgroundColor: "#034488" }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
