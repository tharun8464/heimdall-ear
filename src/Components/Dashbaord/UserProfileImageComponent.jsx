import React, { useCallback, useRef, useState } from "react";
import { Dialog } from "@mui/material";
import MyEditor from "./AvatarEditor";
import getStorage, { setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
import { getHeimdallToken } from "../../service/userServices/getHeimdallToken";
import swal from "sweetalert";
import { getProfileImage, updateProfileImage, deleteProfileImage } from "../../service/api";
import { useSelector } from "react-redux";
import styles from "./UserProfileImageComponent.module.css";
import Button from "../Button/Button";
import UserAvatar from "../../assets/images/UserAvatar.png"
import useUser from "../../Hooks/useUser";
import { useEffect } from "react";
import { toast } from "react-toastify";

const UserProfileImageComponent = ({ openDialog, setOpenDialog, profileImg, setProfileImg, setEditImage }) => {
  const [rotate, setRotate] = useState(0);
  const [zoom, setZoom] = useState(1);
  const userDetails = useSelector(state => state?.user?.userDetails);
  const [loadings, setLoadings] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(profileImg ? profileImg : null);
  const [onImageChange, setonImageChange] = React.useState(null);
  const [imageDataLength, setImageDataLength] = useState(null);
  const userProfileImage = useSelector(state => state.profile.userProfileImage);
  const { handleGetUserProfileImage } = useUser()
  const avatarRef = useRef();

  const fileInputRef = useRef(null);

  function readFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  useEffect(() => {
    async function calculateImageData() {
      //let access_token1 = getStorage("access_token");
      //let image = await getProfileImage({ id: userDetails?.user?._id }, access_token1);
      //console.log(profileImg)
      //console.log(userProfileImage)
      let slicedString = profileImg?.substring(profileImg.length - 50);
      setImageDataLength(slicedString);
    }
    calculateImageData();
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file?.size > 10000000) {
        swal({
          icon: "error",
          title: "Oops",
          text: "Please upload file less than 10mb",
          button: "Continue",
        });
        return
      }
      let extension = file?.name.split(".")
      extension = extension[extension?.length - 1]
      if (extension === "png" || extension === "jpg" || extension === "jpeg") {
        let imageDataUrl = await readFile(file);
        setImageSrc(imageDataUrl);
      }
      else {
        swal({
          icon: "error",
          title: "Oops",
          text: "Please upload .jpg , .png or .jpeg file",
          button: "Continue",
        });
      }
    }
  };

  const handleDelete = async () => {
    // setImageSrc(null);
    // setImageSrc(UserAvatar);

    swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      buttons: true,
    }).then((ok) => {
      if (ok) {

        // ---------------------------------------
        setImageSrc(UserAvatar);

        setLoadings(true)

        setTimeout(async () => {
          const canvas = avatarRef?.current?.getImageScaledToCanvas();
          const editedImage = canvas?.toDataURL();

          let access_token1 = getStorage("access_token");
          let userS = getSessionStorage("user");
          let user = JSON.parse(userS);
          const formData = new FormData();
          let blob = await fetch(editedImage).then(r => r.blob());
          blob.originalname = userDetails?.user._id + "-profile";
          formData.append("user_id", userDetails?.user._id);
          formData.append("file", blob);
          formData.append("currentImg", editedImage)


          let res = await deleteProfileImage(formData, userDetails?.user?._id, access_token1);

          // setImageSrc(UserAvatar);
          if (res?.status === 200) {
            await handleGetUserProfileImage(userDetails?.user?._id);
            //let image = await getProfileImage({ id: userDetails?.user?._id }, access_token1);
            user.profileImg = user._id + "-profile";
            setSessionStorage("user", JSON.stringify(userDetails?.user));
            setSessionStorage("profileImg", JSON.stringify(userProfileImage?.Image));
            setImageSrc(userProfileImage?.Image);
            setEditImage(blob)

            swal({
              icon: "success",
              title: "Success",
              text: "Profile Picture Deleted",
              button: "Continue",
            }).then(() => {
              // window.location.reload();

              setOpenDialog(false);
            });
            setLoadings(false)

          } else {
            swal({
              icon: "error",
              title: "Oops",
              text: "Something Went Wrong",
              button: "Continue",
            }).then(() => {
              // window.location.reload();
              setOpenDialog(false);
            });
            setLoadings(false)
          }

        }, 500)
        // --------------------------------------

      };
    });
  };

  const handleSave = async () => {
    const canvas = avatarRef?.current?.getImageScaledToCanvas();
    const editedImage = canvas?.toDataURL();

    console.log("onImageChange:", onImageChange);
    let access_token1 = getStorage("access_token");
    let userS = getSessionStorage("user");
    let user = JSON.parse(userS);
    const formData = new FormData();
    let blob = await fetch(editedImage).then(r => r.blob());
    blob.originalname = userDetails?.user._id + "-profile";
    formData.append("user_id", userDetails?.user._id);
    formData.append("file", blob);
    formData.append("currentImg", editedImage)
    let res = await updateProfileImage(formData, userDetails?.user?._id, access_token1);

    if (res.status === 200 && res.data.data?.NoOfPeople === 1) {
      await handleGetUserProfileImage(userDetails?.user?._id)
      setLoadings(false);
      //let image = await getProfileImage({ id: userDetails?.user?._id }, access_token1);
      if (userProfileImage) {
        user.profileImg = user._id + "-profile";
        setSessionStorage("user", JSON.stringify(userDetails?.user));
        setSessionStorage("profileImg", JSON.stringify(userProfileImage?.Image));
        setImageSrc(userProfileImage?.Image);
        setEditImage(blob);
        setProfileImg(userProfileImage?.Image);
        toast.success('Profile image updated successfully!');
        setOpenDialog(false);
      }
    } else if (res.status === 200 && res.data.data?.NoOfPeople !== 1) {
      setLoadings(false);
      toast.error('Please upload a valid image!');
    } else {
      setLoadings(false);
      toast.error('Something went wrong!');
    }

  };
  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      // fullWidth
      maxWidth="md">
      <div className={styles.ImgEditPopup}>
        <div
          className={`flex justify-between items-center border-b border-gray-200 pb-2 mb-2 ${styles.ImgEditPopupHeader}`}>
          <div className="flex items-center">
            <span className={styles.Heading}>Profile Name</span>
          </div>
          <button onClick={() => setOpenDialog(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <MyEditor
          avatarRef={avatarRef}
          image={imageSrc}
          rotate={rotate}
          zoom={zoom}
          setonImageChange={setonImageChange}
        />
        {imageSrc && (
          <div className={styles.RangeWrapper}>
            <div className={`flex items-center ${styles.Range}`}>
              <label className={styles.SubHeading}>Rotate:</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotate}
                onChange={e => setRotate(parseInt(e.target.value))}
                className={styles.rotateSlider}
              />
            </div>
            <div className={`flex items-center ${styles.Range}`}>
              <label className={styles.SubHeading}>Zoom</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className={styles.rotateSlider}
              />
            </div>
          </div>
        )}
        <div className={`flex justify-end ${styles.BtnWrapper}`}>
          <Button
            // text={"Delete"}
            text={loadings ? "Deleting" : "Delete"}
            onClick={handleDelete}
            btnType={"secondary"}
            className={styles.DeleteBtn}
            isDisabled={imageDataLength === '2Rm+jpSHs0tWrw3xh6s7n/A1sioZlHsbt2AAAAAElFTkSuQmCC' ? true : false}
          />

          <input
            type="file"
            id="fileInputImage"
            style={{ display: "none" }}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <div className={styles.Btn}>
            <Button
              className={`${styles.UploadBtn} bg-white`}

              btnType={"secondary"}
              text={"Upload New"}
              onClick={handleFileSelect}
            />
            <Button text={"Save"} onClick={() => {handleSave(), setOpenDialog(false)}} btnType={"primary"} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default UserProfileImageComponent;
