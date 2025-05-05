import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { psycholinguisticsTestLevel1 } from '../../../service/gamifiedPsychoTestService';
import { serverErrorNotification } from '../../../utils/serverErrorNotification';
import { getLevel1Question, saveLevelOneScore } from '../../../service/api';
import {
  getStorage,
  getSessionStorage,
} from "../../../service/storageService";

const LEVEL_ONE__MIN_WORD_LIMIT = 75;
const LEVEL_ONE__MAX_WORD_LIMIT = 115;
function Level1Question({ setLevel1Report, setLevel, token, userId, onFinish }) {

  const [level1Question, setLevel1Question] = useState(null);
  const [level1Answer, setLevel1Answer] = useState('');
  const [level1AnswerWordCount, setLevelAnswer1WordCount] = useState(0);
  const [isSubmissionLoading, setIsSubmissionLoading] = useState(false);
  const [isBigfivecopy, setIsbigfivecopy] = useState(false);
  const isLevel1AnswerLengthValid = (level1AnswerWordCount >= LEVEL_ONE__MIN_WORD_LIMIT && level1AnswerWordCount <= LEVEL_ONE__MAX_WORD_LIMIT)

  const headers = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (userId) {
      fetchLevel1Question();
    }
    const big5 = JSON.parse(getSessionStorage("configurations"));
    setIsbigfivecopy(big5?.bigFiveCopyPaste);
  }, [userId])


  useEffect(() => {
    const calculateWordCount = (answer) => {
      const words = answer.trim().split(/\s+/);
      return words.filter(Boolean).length;
    }

    setLevelAnswer1WordCount(calculateWordCount(level1Answer));
  }, [level1Answer])

  const fetchLevel1Question = async () => {
    if (userId) {
      //console.log("userId: ", userId);
      const res = await getLevel1Question(userId);
      //console.log("level 1 question: ", res.data.question);
      setLevel1Question(res.data.question);
    }
  }

  function handleCopyPaste(event) {
    const condition = true; // Replace this with your actual condition
    if (isBigfivecopy) {
      // Allow the copy/paste event
      return;
    } else {
      // Prevent the copy/paste event
      event.preventDefault();
      return false;
    }
  }


  function handleSubmitLevel1() {
    if (isLevel1AnswerLengthValid && !isSubmissionLoading) {
      const data = {
        situationType: level1Question?.questionSituationType,
        text: level1Answer
      }
      //setLevel(prevLevel => prevLevel + 1);
      setIsSubmissionLoading(true);
      //console.log("headers", headers)
      psycholinguisticsTestLevel1(data, headers)
        .then((res) => {
          setIsSubmissionLoading(false);
          //console.log("===========================63")
          setLevel1Report(res.data)
          //console.log(res?.data)
          //console.log("===========================65")
          const scores = {
            userId: userId,
            situationType: level1Question?.questionSituationType,
            text: level1Answer,
            OCEAN_scores: res.data.OCEAN_scores
          }
          //console.log("===========================72")
          saveLevelOneScore(scores);
          //console.log("===========================74")
          onFinish();
        }
        ).catch((err) => {
          setIsSubmissionLoading(false);
          //console.log("error: ", err);
          serverErrorNotification();
        });
    }
  }

  return (
    <div className='flex flex-col flex-grow overflow-y-auto overflow-x-hidden'>
      <div className='flex flex-col p-4 flex-grow mt-16 space-y-8'>
        <div className='text-lg md:pl-2 flex font-semibold text-black/70'>
          {`Question 1. ${level1Question?.question}`}
        </div>
        <div className='flex flex-col flex-grow space-y-2'>
          <textarea
            onChange={e => setLevel1Answer(e.target.value)}
            onPaste={(e) => handleCopyPaste(e)}
            onCopy={(e) => handleCopyPaste(e)}
            placeholder='Write your answer here'
            className='w-full h-full text-base font-normal flex-grow text-black/70 outline-none border border-black/10 rounded-md resize-none focus:border-green-200' />
          <div >75 - 115 words required &#40;<span className={isLevel1AnswerLengthValid ? `text-green-500` : `text-red-500`}>{`${level1AnswerWordCount} words`}</span>&#41;</div>
        </div>
      </div>
      <div className='flex flex-row items-center justify-center py-4 space-x-4'>
        <div className={`${isLevel1AnswerLengthValid ? 'bg-[#228276]' : 'bg-[#B3B3B3]'} ${isSubmissionLoading ? 'opacity-50 hover:cursor-wait' : 'hover:cursor-pointer'} text-white font-semibold px-16 py-2 rounded-md hover:opacity-90`} onClick={handleSubmitLevel1}>
          {isSubmissionLoading ? <AiOutlineLoading3Quarters size={20} className='animate-spin ' /> : "Submit"}
        </div>
      </div>
    </div>
  )
}

export default Level1Question