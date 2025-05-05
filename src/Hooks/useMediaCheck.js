import { useState } from "react";

const useMediaCheck = () => {
  const [mediaCheck, setMediaCheck] = useState({});
  const handleCamCheck = () => {
    //save state of cam permission & check if cam permission is changed
    navigator.permissions
      .query({ name: "camera" })
      .then((permissionStatus) => {
        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            setMediaCheck((prevState) => ({ ...prevState, camAccess: true }));
          } else {
            setMediaCheck((prevState) => ({ ...prevState, camAccess: false }));
          }
        };
        if (permissionStatus.state === "granted") {
          setMediaCheck((prevState) => ({ ...prevState, camAccess: true }));
        } else {
          setMediaCheck((prevState) => ({ ...prevState, camAccess: false }));
        }
      })
      .catch((error) => {
        console.error("Error checking camera permission:", error);
      });
  };
  const handleMicCheck = () => {
    //save state of mic permission & check if cam permission is changed
    navigator.permissions
      .query({ name: "microphone" })
      .then((permissionStatus) => {
        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            setMediaCheck((prevState) => ({ ...prevState, micAccess: true }));
          } else {
            setMediaCheck((prevState) => ({ ...prevState, micAccess: false }));
          }
        };
        if (permissionStatus.state === "granted") {
          setMediaCheck((prevState) => ({ ...prevState, micAccess: true }));
        } else {
          setMediaCheck((prevState) => ({ ...prevState, micAccess: false }));
        }
      })
      .catch((error) => {
        console.error("Error checking camera permission:", error);
      });
  };
  return { handleCamCheck, handleMicCheck, mediaCheck };
};

export default useMediaCheck;
