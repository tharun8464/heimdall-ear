import React, { useEffect, useRef, useState } from 'react'
import useNewBaselining from '../../../../Hooks/useNewBaselining';
import { notify } from '../../../../utils/notify';

function HeadMovementDetectionComponent({ start, onComplete, onScreenshot, inviteId }) {

    const counterRef = useRef();
    const [step, setStep] = useState(0);
    const [counterRunning, setCounterRunning] = useState(false);
    const [counter, setCounter] = useState(5);
    const { handleHeadMovementDetection } = useNewBaselining();
    const [waiting, setWaiting] = useState(false);
    const [tryAgain, setTryAgain] = useState(false);
    const [tryCounter, setTryCounter] = useState(0);

    useEffect(() => {
        if (start) {
            //console.log("start effect: ", start);
            // onComplete(prev => prev + 1);
            setCounterRunning(true);
        }
    }, [start])

    useEffect(() => {
        //console.log("counterRunning: ", counterRunning, " counter: ", counter, "step: ", step);
        if (counterRunning && counter > 0) {
            if (counterRef.current)
                clearInterval(counterRef.current);

            counterRef.current = setInterval(() => {
                setCounter(counter => counter > 0 ? counter - 1 : 0);
            }, 1000);
        } else {
            if (counterRef.current) {
                clearInterval(counterRef.current);
            }
        }

        startHeadMovementDetection();

        return () => {
            if (counterRef.current)
                clearInterval(counterRef.current);
        }
    }, [counterRunning, counter])

    useEffect(() => {
        if (tryCounter > 5) {
            onComplete(prev => prev + 1);
        }
    }, [tryCounter])

    function checkHeadPosition(orientation) {
        const headPositionImage = onScreenshot();
        //console.log("headPositionImage: ", headPositionImage);
        const data = {
            img: headPositionImage,
            Orientation: orientation,
            MeetingId: inviteId
        }
        setWaiting(true);
        handleHeadMovementDetection(data, onSuccess, onError);
    }

    function onSuccess() {
        //console.log("head position success");
        setWaiting(false);
        setStep(prevStep => prevStep + 1);
        setTryCounter(0);
        setCounter(5);
        setCounterRunning(true);
    }
    function onError(error) {
        //console.log("got error on head movement detection api: ", error);
        notify("Failed to detect head position, try again");
        setWaiting(false);
        setTryAgain(true);
        setCounterRunning(false);
    }

    function startHeadMovementDetection() {
        if (counter === 0) {
            if (step === 0) {
                setStep(prevStep => prevStep + 1);
                setCounter(5);
            } else if (step === 1) {
                const orientation = 'straight';
                checkHeadPosition(orientation);
            } else if (step === 2) {
                const orientation = 'left';
                checkHeadPosition(orientation);
            } else if (step === 3) {
                const orientation = 'right';
                checkHeadPosition(orientation);
            } else if (step === 4) {
                const orientation = 'up';
                checkHeadPosition(orientation);
            } else if (step === 5) {
                const orientation = 'down';
                checkHeadPosition(orientation);
            } else if (step === 6) {
                if (counterRef.current) {
                    clearInterval(counterRef.current);
                    onComplete(prev => prev + 1);
                }
            }
        }
    }

    function stepMessage() {
        if (step === 0) {
            return "Head Movement Detection Start in";
        } else if (step === 1) {
            return "Look at the centre of the screen";
        } else if (step === 2) {
            return "Look at the left side of the screen";
        } else if (step === 3) {
            return "Look at the right side of the screen";
        } else if (step === 4) {
            return "Look top of the screen";
        } else if (step === 5) {
            return "Look down of the screen";
        } else if (step === 6) {
            return "Head movement detection completed.";
        }
    }

    function handleTryAgain() {
        //console.log("try again clicked");
        setTryAgain(false);
        setTryCounter(prev => prev + 1);
        setCounter(5);
        setCounterRunning(true)
    }
    return (
        <div className='flex space-x-2 border py-2 px-8 rounded-md bg-white drop-shadow-md items-start'>
            <div className='text-base font-normal'>{stepMessage()}</div>
            <div className='mx-4 w-[1px] h-full py-1 bg-black/30' />
            <div className={`text-base font-normal bg-slate-300 rounded border px-2 text-green-700 ${tryAgain ? "hidden" : "flex"}`}>
                {waiting ? "wait..." : counter}
            </div>
            <div className={`text-base font-normal bg-slate-300 rounded border px-2 text-green-700 hover:cursor-pointer ${tryAgain ? "flex" : "hidden"}`} onClick={handleTryAgain}>
                Try Again
            </div>
        </div>
    )
}

export default HeadMovementDetectionComponent