import React, { useEffect, useState } from 'react'
import useNewBaselining from '../../../Hooks/useNewBaselining';
import { useSelector } from 'react-redux';
import Level3Question from './Level3Question';
import useScreenSize from '../../../Hooks/useScreenSize'
import Confetti from 'react-confetti';
import getStorage, { getSessionStorage } from '../../../service/storageService';
import Level1Question from './Level1Question';
import Level2Question from './Level2Question';
import LevelTimer from './LevelTimer';
import { useNavigate } from 'react-router-dom';


const circles = [
    {
        w: '144px',
        h: '144px',
        color: 'blue',
    },
    {
        w: '256px',
        h: '262px',
        color: 'orange',
    },
    {
        w: '190px',
        h: '200px',
        color: 'green',
    }
];

function LevelTransition({ currentLevel, onStart }) {
    const screenSize = useScreenSize();
    const [divPositions, setDivPositions] = useState([]);

    const getRandomCoordinate = (maxWidth, maxHeight, divSize) => ({
        x: Math.floor(Math.random() * (maxWidth - divSize)),
        y: Math.floor(Math.random() * (maxHeight - divSize))
    });

    useEffect(() => {
        const randomCoordinates = Array.from({ length: 3 }, () => (
            getRandomCoordinate(screenSize.width, screenSize.height, 250)
        ));

        setDivPositions(randomCoordinates);
    }, [screenSize]);





    return (
        <div className="relative h-full bg-black/80 w-full">
            <Confetti width={screenSize.width} height={screenSize.height} recycle={false} />
            {
                divPositions.map((divPosition, index) => (
                    <div key={index} className="absolute z-0 rounded-full bg-opacity-20 blur-lg" style={{
                        left: `${divPosition.x}px`,
                        top: `${divPosition.y}px`,
                        width: `${circles[index].w}`,
                        height: `${circles[index].h}`,
                        backgroundColor: `${circles[index].color}`,
                        opacity: '0.5'
                    }} />
                ))
            }
            <div className="absolute z-50 inset-0 flex items-center justify-center">
                <div className="bg-white/5 bg-opacity-10 rounded-lg shadow-lg backdrop-blur-lg drop-shadow-lg px-16 py-8 md:px-32 md:py-16 flex flex-col justify-center items-center space-y-2">
                    <h1 className="text-xl font-semibold text-white text-center">Congratulations on completing Level {currentLevel}!</h1>
                    <p className="text-white">Let's proceed to Level {currentLevel + 1}</p>
                    <button
                        onClick={onStart}
                        className="mt-4 bg-[#228276] text-white py-2 px-4 rounded hover:bg-[#228276]"
                    >
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
}

function Question() {
    const [level, setLevel] = useState(1);
    const [user, setUser] = useState(null);
    const { handleGetHeimdallToken } = useNewBaselining();
    const [level1Report, setLevel1Report] = useState(null);
    const [discReport, setDiscReport] = useState(null);
    const heimdallToken = useSelector(state => state.baselining.heimdallToken);
    const navigate = useNavigate();
    const [timerKey, setTimerKey] = useState(Date.now()); // Key to reset the timer
    const [isTransitioning, setIsTransitioning] = useState(false); // State for transition page

    useEffect(() => {
        handleGetHeimdallToken();
        let userDetails = JSON.parse(getSessionStorage("user"));
        setUser(userDetails);
    }, []);

    function resetTimer() {
        setTimerKey(Date.now()); // Reset timer by changing key
    }

    const question = () => {
        switch (level) {
            case 1:
                return {
                    title: 'Level 1',
                    testTime: 5 * 60,
                    warningTime: 3 * 60,
                };
            case 2:
                return {
                    title: 'Level 2',
                    testTime: 20,
                    warningTime: 15,
                };
            case 3:
                return {
                    title: 'Level 3',
                    testTime: 2 * 60,
                    warningTime: 1 * 60,
                };
            default:
                return {
                    title: 'Level 1',
                    testTime: 5 * 60,
                    warningTime: 2 * 60,
                };
        }
    };

    function handleLevelTestTimer() {
        setIsTransitioning(true); // Show transition page
    }

    function startNextLevel() {
        setIsTransitioning(false); // Hide transition page
        if (level === 1) {
            setLevel(2);
            resetTimer();
        } else if (level === 2) {
            setLevel(3);
            resetTimer();
        } else {
            navigate('/user');
        }
    }

    return (
        <>
            {isTransitioning ? (
                <LevelTransition currentLevel={level} onStart={startNextLevel} />
            ) : (
                <div className={`relative flex-col w-full h-full rounded-md drop-shadow-md bg-white border flex`}>
                    <div className='fixed top-0 w-full py-3 md:py-4 px-8 z-50 bg-white border-b flex justify-between'>
                        <span className='font-semibold text-lg text-black/80'>{question().title}</span>
                        <LevelTimer
                            key={timerKey} // Use key to force re-render of LevelTimer
                            time={question().testTime}
                            warning={question().warningTime}
                            onFinish={handleLevelTestTimer}
                            level={level} // Pass the current level
                            isPaused={isTransitioning} // Pass the isTransitioning state as isPaused
                        />
                    </div>
                    {level === 1 && (
                        <Level1Question
                            setLevel1Report={setLevel1Report}
                            setLevel={setLevel}
                            token={heimdallToken?.token}
                            userId={user?._id}
                            onFinish={handleLevelTestTimer} // Update Level1Question component to use this
                        />
                    )}
                    {level === 2 && (
                        <Level2Question
                            setLevel={setLevel}
                            userId={user?._id}
                            level1Report={level1Report}
                            linkedinUrl={user?.linkedinurl}
                            setDiscReport={setDiscReport}
                            resetTimer={resetTimer}
                            onFinish={handleLevelTestTimer} // Update Level2Question component to use this
                        />
                    )}
                    {level === 3 && (
                        <Level3Question
                            userId={user?._id}
                            token={heimdallToken?.token}
                            linkedinUrl={user?.linkedinurl}
                            discReport={discReport}
                            resetTimer={resetTimer}
                            onFinish={handleLevelTestTimer} // Update Level3Question component to use this
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default Question;