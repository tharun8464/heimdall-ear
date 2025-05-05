import React, { useState } from "react";
import { getProfileImage } from "../../service/api";
import Avatar from "@mui/material/Avatar";
import Avatarr from '../../assets/images/UserAvatar.png'
import { getStorage, setStorage, getSessionStorage, setSessionStorage } from "../../service/storageService";

const ProfileAvatar = ({ data }) => {

  const [profilePic, setProfilePic] = useState("");
  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getSessionStorage("user"));
      if (data) {
        let image = await getProfileImage({ id: data }, user?.access_token);
        if (image?.status === 200) {
          setSessionStorage("profileImg", JSON.stringify(image));
          // let base64string = btoa(
          //   String.fromCharCode(...new Uint8Array(image?.data?.Image?.data))
          // );
          let base64string = btoa(
            new Uint8Array(image.data.Image.data).reduce(function (data, byte) {
              return data + String.fromCharCode(byte);
            }, ""),
          );
          let src = `data:image/png;base64,${base64string}`;
          await setProfilePic(src);
        }
      }
    };
    initial();
  }, [data]);

  return (
    <Avatar
      src={
        data && profilePic
          ? profilePic
          : Avatarr
      }
      alt={profilePic}
    />
  );
};

export default ProfileAvatar;
