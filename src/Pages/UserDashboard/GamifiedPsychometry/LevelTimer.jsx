import React, { useEffect, useState, useRef } from 'react';
import { notify } from '../../../utils/notify';
import { useNavigate } from 'react-router-dom';

/**
 * Represents a timer for a specific level with countdown functionality.
 *
 * @param {number} time - The initial time in seconds for the timer.
 * @param {function} onFinish - The function to execute when the timer reaches 0.
 * @param {number} warning - The time in seconds to trigger a warning notification.
 * @param {number} level - The current level to determine if a delay is needed.
 * @param {boolean} isPaused - Whether the timer should be paused.
 * @return {JSX.Element} The JSX element displaying the time left for the level.
 */
function LevelTimer({ time, onFinish, warning, key, level, isPaused }) {
    const [secondsLeft, setSecondsLeft] = useState(time);
    const [isDelayActive, setIsDelayActive] = useState(level === 2); // State to track delay
    const intervalId = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const startTimer = () => {
            intervalId.current = setInterval(() => {
                setSecondsLeft((prevSeconds) => {
                    if (prevSeconds <= 1) {
                        clearInterval(intervalId.current);
                        onFinish();
                        navigate('/user'); // Navigate to /user when timer ends
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        };

        if (!isPaused) {
            if (level === 2) {
                const delayId = setTimeout(() => {
                    setIsDelayActive(false); // End the delay
                    setSecondsLeft(time);
                    startTimer();
                }, 10000); // 10-second delay for level 2

                return () => clearTimeout(delayId);
            } else {
                setSecondsLeft(time);
                startTimer();
            }
        }

        return () => clearInterval(intervalId.current);
    }, [time, onFinish, key, level, isPaused, navigate]);

    useEffect(() => {
        if (secondsLeft === warning) {
            notify(`You have ${formatTime()} left to complete the exercise!`, "warning");
        }
    }, [secondsLeft, warning]);

    const formatTime = () => {
        if (secondsLeft < 60) {
            return `${secondsLeft} sec${secondsLeft > 1 ? 's' : ''}`;
        } else {
            const minutes = Math.floor(secondsLeft / 60);
            const seconds = secondsLeft % 60;
            return `${minutes} min${minutes > 1 ? 's' : ''} and ${seconds} sec${seconds > 1 ? 's' : ''}`;
        }
    };

    return (
        !isDelayActive && ( // Only show the timer if the delay is not active
            <div className={`${secondsLeft <= warning ? 'text-red-400' : 'text-gray-500'}`}>
                Time left: {formatTime()}
            </div>
        )
    );
}

export default LevelTimer;
