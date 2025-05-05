import React, { Fragment, useEffect, useRef } from 'react'
import { captureVideoFrame } from '../../../utils/util';
import useSocket from '../../../Hooks/useSocket';

function InterviewVideoFrame({ meetingId }) {
    // worker 
    // const workerRef = useRef();

    const videoRef = useRef(null);
    const intervalRef = useRef();
    //video frame capture quality
    const quality = 0.45;
    const fps = 10

    const path = [
        // { namespace:  '/calibration/frames', path: '/heimdall/api/pinocchio/handshake'}, 
        { namespace: '/proctoring/frames', path: '/heimdall/api/pinocchio/handshake' },
        { namespace: '/proctoring/frames', path: '/heimdall/api/face/handshake' },
        { namespace: '/proctoring/frames', path: '/heimdall/api/gaze/handshake' },
        { namespace: '/proctoring/frames', path: '/heimdall/api/person/handshake' },
        { namespace: '/proctoring/frames', path: '/heimdall/api/ear/handshake' },
    ]
    const socketParams = {
        meetingId: meetingId,
        focus: 'TopRight'
    }

    const socket = useSocket(path, socketParams);

    useEffect(() => {
        if (socket) {
            getMediaStream(socket)
        }

        return () => {
            if (intervalRef.current) {
                //console.log("clearing interval: ", intervalRef.current);
                clearInterval(intervalRef.current);
            }
        }
    }, [socket])

    async function getMediaStream(socket) {
        //console.log("getting media stream");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            // console.log("socket: ", socket);
            intervalRef.current = setInterval(() => {
                let image = captureVideoFrame(videoRef.current, quality);
                socket.forEach((socket) => {
                    if (socket.connected) {
                        socket.emit('message', image);
                        // socket.on('ImageRecieverResponse', (data) => {
                        //     console.log("received response: ", data);
                        // })
                    }
                });
            }, 1000 / fps)
        } catch (error) {
            //console.log('error while getting media stream: ', error);
        }
    }

    return (
        <Fragment>
            {/* <video ref={videoRef} autoPlay muted playsInline className='invisible'/> */}
            <video ref={videoRef} autoPlay muted playsInline className='hidden' />
        </Fragment>
    )
}

export default InterviewVideoFrame