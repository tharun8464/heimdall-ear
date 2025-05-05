import React, { useEffect, useState } from 'react'
import useScreenSize from '../../../Hooks/useScreenSize'
import Confetti from 'react-confetti';
import { updateGamifiedPsychometryProgress } from '../../../service/api';

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
]

function TestFinished({ inviteId }) {
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
    }, []);

    const handleConfettiComplete = () => {
        updateTestProgress()
        setTimeout(() => {
            window.location.href = "/user"
        }, 5000);
    }

    async function updateTestProgress() {
        await updateGamifiedPsychometryProgress({ inviteId: inviteId, progress: 'Completed' });
    }

    return (
        <div className="relative h-full bg-black/80 w-full">
            <Confetti width={screenSize.width} height={screenSize.height} recycle={false} onConfettiComplete={handleConfettiComplete} />
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
                    <h1 className="text-xl font-semibold text-white text-center">Congratulation !</h1>
                    <p className="text-white">The activity is complete</p>
                </div>
            </div>
        </div>
    )
}

export default TestFinished
