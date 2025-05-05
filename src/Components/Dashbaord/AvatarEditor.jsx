import React, { useRef } from "react";
import AvatarEditor from "react-avatar-editor";

const MyEditor = ({ image, rotate, zoom, setonImageChange, avatarRef }) => {

  // const handleImageChange = () => {
  //   const canvas = avatarRef.current.getImageScaledToCanvas();
  //   const editedImage = canvas.toDataURL();
  //   setonImageChange(editedImage);
  // };

  return (
    <>
      <AvatarEditor
        ref={avatarRef}
        image={image}
        border={50}
        color={[255, 255, 255, 0.6]} // RGBA
        scale={zoom}
        rotate={rotate}
        borderRadius={100}
        style={{ backgroundColor: image ? "transparent" : "#c4c4c4" }}
      // onImageChange={handleImageChange}
      />
      {/* <button onClick={handleImageChange}>Apply Changes</button> */}
    </>
  );
};

export default MyEditor;
