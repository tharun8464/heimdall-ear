import React, { useEffect, useRef, useState } from 'react'
import GamifiedPsychometryBaseline from './GamifiedPsychometryBaseline';
import useSocket from '../../../Hooks/useSocket';
import { captureVideoFrame } from '../../../utils/util';
import ActivityGuideline from './ActivityGuideline';
import Question from './Question';
import { useSelector } from 'react-redux';
import TestFinished from './TestFinished';
import { useParams } from 'react-router-dom';
import { getConfigDetails } from '../../../service/api';
import { getSessionStorage } from '../../../service/storageService';

function GamifiedPsychometryTest() {

  const isTestFinished = useSelector((state) => state.gamifiedPsychoSlice.isTestFinished);
  const { id } = useParams();
  const [isBaselineCompleted, setIsBaselineCompleted] = useState(false); //Checking baselining status
  const [showGuide, setShowGuide] = useState(true);
  const videoRef = useRef();
  const intervalRef = useRef();

  const quality = 0.45;
  const fps = 10;

  const path = [{ namespace: '/frames', path: '/heimdall/api/microexpressions/handshake' }]

  const socketParam = {
    meetingId: id,
  }

  const socket = useSocket(path, socketParam);


  const disableBaselining = JSON.parse(getSessionStorage("configurations"))?.disable_big5_baselining || false;
  let earPieceDetectionCountDB = JSON.parse(getSessionStorage("configurations"))?.earPieceDetectionAttempt || 0;
  if (typeof earPieceDetectionCountDB !== "number") {
    earPieceDetectionCountDB = 0;
  }
  earPieceDetectionCountDB = parseInt(earPieceDetectionCountDB);


  if (earPieceDetectionCountDB < 0) {
    earPieceDetectionCountDB = 0;
  }


  useEffect(() => {
    if (socket && isBaselineCompleted) {
      getMediaStream(socket);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [socket, isBaselineCompleted]);

  async function getMediaStream(socket) {
    //console.log("getting media stream");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      //console.log("socket: ", socket);
      intervalRef.current = setInterval(() => {
        let image = captureVideoFrame(videoRef.current, quality);
        socket.forEach((socket) => {
          if (socket.connected) {
            socket.emit('message', image);
            // socket.on('ImageRecieverResponse', (data) => {
            //     //console.log("received response: ", data);
            // })
          }
        });
      }, 1000 / fps)
    } catch (error) {
      //console.log('error while getting media stream: ', error);
    }
  }

  React.useEffect(() => {
    const initial = async () => {
      await getConfigDetails()
    }
    initial()
  })



  return (
    <div className='flex flex-col justify-center items-center'>
      {
        !isBaselineCompleted && disableBaselining === false
          ? <GamifiedPsychometryBaseline onBaselineCompleted={setIsBaselineCompleted} inviteId={id} earPieceDetectionCountDB={earPieceDetectionCountDB} />
          : (
            <div className='w-screen h-screen overflow-hidden'>
              {
                !isTestFinished
                  ? <div className='w-screen h-screen py-8 md:py-20 flex justify-center items-center bg-black/80 relative'>
                    <div className='flex relative flex-col w-4/5 h-full rounded-md drop-shadow-md bg-white '>
                      <div className={`w-full h-full ${showGuide ? 'block' : 'hidden'}`} >
                        <ActivityGuideline onStart={() => setShowGuide(false)} />
                      </div>
                      <div className={`w-full h-full ${!showGuide && !isTestFinished ? 'block' : 'hidden'}`}>
                        <Question />
                      </div>
                    </div>
                    <video ref={videoRef} autoPlay muted playsInline className='w-64 aspect-video rounded-md border border-white/10 drop-shadow-md absolute right-10 bottom-10 z-50' />
                  </div>
                  : <TestFinished inviteId={id} />
              }
            </div>
          )
      }
    </div>
  )
}

export default GamifiedPsychometryTest