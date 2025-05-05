import React, { useEffect, useRef, useState } from 'react';
import { CustomSelectInput } from '../../CustomInput/CustomInput';
import styles from './PlaygroundComponent.module.css';
import CamTest from "../../../assets/images/Playground/CamTest.svg"
import MicTest from "../../../assets/images/Playground/MicTest.svg"
import ScreenTest from "../../../assets/images/Playground/ScreenTest.svg"
import CamDisabled from "../../../assets/images/Playground/CamDisabled.svg"
import MicDisabled from "../../../assets/images/Playground/MicDisabled.svg"

import MicWarning from "../../../assets/images/Playground/MicWarning.svg"
import CamWarning from "../../../assets/images/Playground/CamWarning.svg"
import Button from '../../Button/Button';
import logo_new from "../../../assets/images/logo_new.png"
import speakerSound from "../../../assets/sounds/speakerSound.mp3"
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AllowAccessPopup from './AllowAccessPopup/AllowAccessPopup';
// draft


const PlaygroundComponent = ({ setShowPlayground }) => {
    const camVideoRef = useRef(null);
    const screenShareVideoRef = useRef(null);
    const [cameraOptions, setCameraOptions] = useState([]);

    const [audioInputOptions, setAudioInputOptions] = useState([]);
    const [audioOutputOptions, setAudioOutputOptions] = useState([]);

    const [selectedCamera, setSelectedCamera] = useState(null);
    const [selectedMicrophone, setSelectedMicrophone] = useState(null);

    const [selectedSpeaker, setSelectedSpeaker] = useState(null);
    const [micLevel, setMicLevel] = useState(0);
    const [micLevelAnimationFrame, setMicLevelAnimationFrame] = useState(null);

    const [screenShareStream, setScreenShareStream] = useState(null);
    const [audioElement, setAudioElement] = useState(null);

    const [camEnabled, setCamEnabled] = useState(false);
    const [micEnabled, setMicEnabled] = useState(false);
    const [camPermission, setCamPermission] = useState('prompt');
    const [micPermission, setMicPermission] = useState('prompt');

    const [hasPermissionDeniedOnce, setHasPermissionDeniedOnce] = useState(false);

    const [canAskPermission, setCanAskPermission] = useState(true);

    const [cameraStream, setCameraStream] = useState(null);
    const [microphoneStream, setMicrophoneStream] = useState(null);


    const checkPermissions = async () => {
        //console.log("Check permission ran");
        try {
            const cameraPermission = await navigator.permissions.query({ name: 'camera' });
            const microphonePermission = await navigator.permissions.query({ name: 'microphone' });

            setCanAskPermission(
                cameraPermission.state !== 'denied' && microphonePermission.state !== 'denied'
            );
        } catch (error) {
            //console.error('Error checking permissions:', error);
            setCanAskPermission(false);
        }
    };

    const getCameraFeed = async () => {
        try {
            const constraints = {
                video: {
                    deviceId: selectedCamera ? { exact: selectedCamera } : undefined
                }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (camVideoRef.current) {
                camVideoRef.current.srcObject = stream;
            }
            setCameraStream(stream);
            return stream;
        } catch (error) {
            checkPermissions()
            setHasPermissionDeniedOnce(true);
            //console.error('Error accessing camera: ', error);
        }
    };



    const getMicrophoneFeed = async () => {
        if (!micEnabled) {
            setMicLevel(0);
            if (micLevelAnimationFrame) {
                cancelAnimationFrame(micLevelAnimationFrame);
            }
            return;
        }

        try {
            //console.log("getMicrophoneFeed")
            const constraints = {
                audio: {
                    deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined
                }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setMicrophoneStream(stream);
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            source.connect(analyser);

            const updateMicLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const max = Math.max(...dataArray);
                setMicLevel(max);
                const frame = requestAnimationFrame(updateMicLevel);
                setMicLevelAnimationFrame(frame);
            };

            updateMicLevel();
        } catch (error) {
            setHasPermissionDeniedOnce(true);
            //console.error('Error accessing microphone: ', error);
            checkPermissions()
        }
    };

    const getMediaDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
            const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');

            const videoOptions = videoDevices.map(device => ({
                text: device.label || `Camera ${device.deviceId}`,
                value: device.deviceId
            }));

            const audioInputOptions = audioInputDevices.map(device => ({
                text: device.label || `Microphone ${device.deviceId}`,
                value: device.deviceId
            }));

            const audioOutputOptions = audioOutputDevices.map(device => ({
                text: device.label || `Speaker ${device.deviceId}`,
                value: device.deviceId
            }));

            setCameraOptions(videoOptions);
            setAudioInputOptions(audioInputOptions);
            setAudioOutputOptions(audioOutputOptions);
        } catch (error) {
            //console.error('Error getting media devices: ', error);
        }
    };

    useEffect(() => {
        if (camEnabled && !screenShareStream) {
            getCameraFeed();
        } else if (!camEnabled && camVideoRef.current && camVideoRef.current.srcObject) {
            camVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            camVideoRef.current.srcObject = null;
        }
        getMicrophoneFeed();
        getMediaDevices();
    }, [selectedCamera, selectedMicrophone, selectedSpeaker, camEnabled, micEnabled, screenShareStream]);


    useEffect(() => {
        if (microphoneStream) {
            const track = microphoneStream.getAudioTracks()[0];
            track.onended = () => {
                //console.log("Microphone permission revoked");
                setMicEnabled(false);
                setMicPermission('denied');
                setHasPermissionDeniedOnce(true);
                checkPermissions();
            };
        }
    }, [microphoneStream]);

    const handleSelectChange = async (event, type) => {
        const value = event.target.value;
        if (type === 'camera') {
            setSelectedCamera(value);
        } else if (type === 'microphone') {
            setSelectedMicrophone(value);
        } else if (type === 'speaker') {
            setSelectedSpeaker(value);
            if (audioElement) {
                try {
                    await audioElement.setSinkId(value);
                } catch (error) {
                    //console.error('Error setting audio output device:', error);
                }
            }
        }
    };

    const handleCamEnabled = () => {
        setCamEnabled(prev => !prev);
    }

    const handleMicEnabled = () => {
        setMicEnabled(prev => !prev);
        if (!micEnabled) {
            getMicrophoneFeed();
        } else {
            setMicLevel(0);
            if (micLevelAnimationFrame) {
                cancelAnimationFrame(micLevelAnimationFrame);
            }
        }
    }

    const handleScrenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            setScreenShareStream(stream);
            if (screenShareVideoRef.current) {
                screenShareVideoRef.current.srcObject = stream;
            } else {
                //console.error('screenShareVideoRef is null');
            }

            stream.getVideoTracks()[0].addEventListener('ended', () => {
                setScreenShareStream(null);
                if (camEnabled && camPermission === 'granted') {
                    getCameraFeed();
                }
            });
        } catch (error) {
            //console.error('Error sharing screen:', error);
        }
    }

    const handleExitPlayground = () => {
        setShowPlayground(false)
    }

    const handleContactUs = () => { }

    const handleSpeakerTest = async () => {
        if (audioElement) {
            try {
                if (selectedSpeaker) {
                    await audioElement.setSinkId(selectedSpeaker);
                }
                await audioElement.play();
            } catch (error) {
                //console.error('Error playing audio:', error);
            }
        }
    };

    useEffect(() => {

        //this is for checking only 
        const checkMediaPermissions = async () => {
            const checkCameraPermission = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setCamEnabled(true);
                    setCamPermission('granted');
                    stream.getTracks().forEach(track => track.stop());
                } catch (error) {
                    setHasPermissionDeniedOnce(true)
                    checkPermissions()
                    //console.error('Error checking camera permission:', error);
                    setCamEnabled(false);
                    if (error.name === 'NotAllowedError') {
                        setCamPermission('denied');
                    }
                }
            };

            const checkMicrophonePermission = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    setMicEnabled(true);
                    setMicPermission('granted');
                    stream.getTracks().forEach(track => track.stop());
                } catch (error) {
                    setHasPermissionDeniedOnce(true)
                    checkPermissions()
                    //console.error('Error checking microphone permission:', error);
                    setMicEnabled(false);
                    if (error.name === 'NotAllowedError') {
                        setMicPermission('denied');
                    }
                }
            };

            await checkCameraPermission();
            await checkMicrophonePermission();
        };

        checkMediaPermissions();
        getMediaDevices();

        // Add event listener for device changes
        navigator.mediaDevices.addEventListener('devicechange', getMediaDevices);

        // Cleanup function
        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', getMediaDevices);
        };
    }, []);

    useEffect(() => {
        setAudioElement(new Audio(speakerSound));
    }, []);

    useEffect(() => {
        if (screenShareVideoRef.current && screenShareStream) {
            screenShareVideoRef.current.srcObject = screenShareStream;
        }
    }, [screenShareStream]);

    useEffect(() => {
        if (camPermission === 'prompt' || micPermission === 'prompt') {
            // setShowAllowAccessPopup(true);
        }
    }, [camPermission, micPermission])


    //console.log('canAskPermission:', canAskPermission)



    const handleGrantAccess = async () => {
        try {
            // Request camera and microphone permissions
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            // Update states
            setCamEnabled(true);
            setMicEnabled(true);
            setCamPermission('granted');
            setMicPermission('granted');
            // Stop the tracks to release the devices
            stream.getTracks().forEach(track => track.stop());

            // Reinitialize camera and microphone feeds
            getCameraFeed();
            getMicrophoneFeed();
        } catch (error) {
            //console.error('Error granting access:', error);
            setHasPermissionDeniedOnce(true);
            checkPermissions();
        }
    };




    useEffect(() => {
        if (cameraStream) {
            const track = cameraStream.getVideoTracks()[0];
            track.onended = () => {
                //console.log("Camera permission revoked");
                setCamEnabled(false);
                setCamPermission('denied');
                setHasPermissionDeniedOnce(true);
                checkPermissions();
            };
        }
    }, [cameraStream]);



    return (
        <div className='fixed inset-0 flex   bg-black bg-opacity-50 backdrop-blur-md z-50'>
            {/* <ShowInstructionsPopup /> */}
            {camPermission !== 'granted' || micPermission !== 'granted' ? <AllowAccessPopup getCameraFeed={getCameraFeed} getMicrophoneFeed={getMicrophoneFeed} onGrantAccess={handleGrantAccess} hasPermissionDeniedOnce={hasPermissionDeniedOnce} canAskPermission={canAskPermission} checkPermissions={checkPermissions} /> : null}
            <div className='flex flex-col gap-5 items-center  w-full'>
                <div className={`${styles.Navbar} w-full`}>
                    <div className={styles.LogoWrapper}>
                        <img src={logo_new} alt="valuematrix" className={styles.Logo} />
                        <h1 className={styles.Heading}>ValueMatrix</h1>
                    </div>
                    <div className={styles.NavLinks}>
                        <Button className={styles.ExitButton} btnType='primary' text={"Exit Playground"} onClick={handleExitPlayground}>
                        </Button>
                        <span className={styles.TroubleText}>Having Trouble?</span>
                        <a href="#">
                            <button className={styles.ContactBtn}>Contact Us</button>
                        </a>
                    </div>
                </div>
                <div className={styles.Wrapper}>
                    <div className='relative ' >
                        {screenShareStream ? (
                            <video
                                className='w-[442px] h-[332px] rounded-md border-[var(--primary-green)] border-2'
                                ref={screenShareVideoRef}
                                autoPlay
                            ></video>
                        ) : camEnabled && camPermission === 'granted' ? (
                            <video
                                className='w-[442px] h-[332px] rounded-md border-[var(--primary-green)] border-2'
                                ref={camVideoRef}
                                autoPlay
                            ></video>
                        ) : (
                            <div className='bg-black w-[442px] h-[332px] rounded-md border-[var(--primary-green)] border-2'></div>
                        )}
                        <div className='flex gap-4 absolute bottom-5 left-1/2 transform -translate-x-1/2'>
                            {camPermission === 'granted' ? (
                                camEnabled ? <img src={CamTest} alt="CamTest" onClick={handleCamEnabled} className='cursor-pointer' />
                                    : <img src={CamDisabled} alt="CamDisabled" onClick={handleCamEnabled} className='cursor-pointer' />
                            ) : (
                                <img src={CamWarning} alt="CamWarning" className='cursor-pointer' />
                            )}
                            {micPermission === 'granted' ? (
                                micEnabled ? <img src={MicTest} alt="MicTest" onClick={handleMicEnabled} className='cursor-pointer' />
                                    : <img src={MicDisabled} alt="MicDisabled" onClick={handleMicEnabled} className='cursor-pointer' />
                            ) : (
                                <img src={MicWarning} alt="MicWarning" className='cursor-pointer' />
                            )}
                            <img
                                src={ScreenTest}
                                alt="ScreenTest"
                                onClick={handleScrenShare}
                                className='cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 w-full'>
                        <CustomSelectInput
                            showLabel
                            label="Camera"
                            selectOptions={cameraOptions}
                            className={styles.SelectInput}
                            onChange={(e) => handleSelectChange(e, 'camera')}
                            showDefaultOption={false}
                        />
                        <div>
                            <CustomSelectInput
                                showLabel
                                label="Microphone"
                                selectOptions={audioInputOptions}
                                className={styles.SelectInput}
                                onChange={(e) => handleSelectChange(e, 'microphone')}
                                showDefaultOption={false}
                            />
                            {micEnabled && (
                                <div className={styles.MicLevelWrapper}>
                                    <div className={styles.MicLevelBar} style={{ width: `${micLevel}%` }}></div>
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <CustomSelectInput
                                showLabel
                                label="Speaker"
                                selectOptions={audioOutputOptions}
                                className={styles.SelectInput}
                                onChange={(e) => handleSelectChange(e, 'speaker')}
                                showDefaultOption={false}
                            />
                            <span
                                className='text-[var(--primary-green)] cursor-pointer text-right'
                                onClick={handleSpeakerTest}
                            >
                                <VolumeUpIcon sx={{ color: 'var(--primary-green)', fontSize: '1rem', marginRight: ".3rem" }} />
                                Test
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default PlaygroundComponent;
