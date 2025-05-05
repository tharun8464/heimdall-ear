import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { useEffect, useState } from "react";
import swal from "sweetalert";

const ProctoringCheck = (props) => {
    const { meeting } = useDyteMeeting();
    const videoEnabled = useDyteSelector((meeting) => meeting.self.videoEnabled);
    const audioEnabled = useDyteSelector((meeting) => meeting.self.audioEnabled);
    const screenShareEnabled = useDyteSelector((meeting) => meeting.self.screenShareEnabled);
    const roomJoined = useDyteSelector((meeting) => meeting.self.roomJoined);
    const [proctrongEnabled, setProctoringEnabled] = useState(false);

    const handleStop = () => {
        // stop screen share
        meeting.self.disableScreenShare();
        // stop webcam
        meeting.self.disableVideo();
        // stop mic
        meeting.self.disableAudio();
        // exit the meeting
        meeting.leaveRoom();
    }

    useEffect(() => {
        const init = async () => {
            try {
                await meeting.join();
            } catch (error) {
                //console.log("Error in joining meeting", error);
            }
        }

        if (roomJoined) {
            //console.log("room joined", meeting, roomJoined);
            verifyShares();
        } else {
            //console.log("room not joined", meeting, roomJoined);
            init();
        }

        return () => {

        }
    }, [roomJoined, screenShareEnabled])

    const verifyShares = async () => {
        //console.log("verifyShares method details", screenShareEnabled)
        try {
            if (videoEnabled) {
                if (audioEnabled) {
                    try {
                        if (!screenShareEnabled) {
                            await meeting.self.enableScreenShare();
                        }
                        if (meeting.self.mediaPermissions.screenshare === 'ACCEPTED') {
                            //console.log("screen share enabled", screenShareEnabled);
                            setProctoringEnabled(true);
                        } else {
                            //console.log("screen share cannot be enabled", screenShareEnabled);
                            handleScreenShareError();
                        }
                    } catch (error) {
                        //console.log("error in screen share", error);
                    }
                } else {
                    handleMicError();
                }
            } else {
                handleWebcamError();
            }
        } catch (error) {
            //console.log("error in screen share", error);
        }
    }

    const handleScreenShareError = () => {
        //console.log("handleScreenShareError", videoEnabled, audioEnabled);
        if (videoEnabled && audioEnabled) {
            meeting.self.disableVideo();
            meeting.self.disableAudio();
        }
        swal({
            icon: "error",
            title: "Screen share issue",
            text: "The screen share is not enabled, please enable it to continue.",
            button: "Ok"
        }).then(() => {
            window.location.reload();
            setProctoringEnabled(false);
        });
    };

    const handleMicError = () => {
        // stop mic
        //console.log("handleMicError", videoEnabled, audioEnabled);
        meeting.self.disableAudio();
        swal({
            icon: "error",
            title: "Mic issue",
            text: "Your mic is not enabled or having problems. Please check your browser or system settings",
            button: "Ok"
        }).then(() => {
            setProctoringEnabled(false);
        });
    };

    const handleWebcamError = () => {
        //console.log("handleWebcamError", videoEnabled, audioEnabled);
        meeting.self.disableVideo();

        swal({
            icon: "error",
            title: "Webcam issue",
            text: "Your webcam is not enabled or having problems. Please check your browser or system settings",
            button: "Ok"
        }).then(() => {
            setProctoringEnabled(false);
        });
    };


    return (
        <>
            {proctrongEnabled && props.renderComponent(handleStop,
                meeting.self.videoEnabled, meeting.self.audioEnabled, meeting.self.screenShareEnabled, verifyShares)}
        </>
    );
}

export default ProctoringCheck;


