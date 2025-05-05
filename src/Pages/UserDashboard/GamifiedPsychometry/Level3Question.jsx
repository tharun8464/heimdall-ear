import React, { useEffect, useState } from 'react'
import { getInviteById, getLevel3Question, saveLevelThreeScore, updateOceanScore } from '../../../service/api';
import Level3QuestionItem from './Level3QuestionItem';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setIsTestFinished } from '../../../Store/slices/gamifiedPsychoSlice';
import { notify } from '../../../utils/notify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { psycholinguisticsTestLevel3 } from '../../../service/gamifiedPsychoTestService';
import { serverErrorNotification } from '../../../utils/serverErrorNotification';
import { extractOCEANScores } from '../../../utils/util';
import usePreEvaluation from '../../../Hooks/usePreEvaluation';
import { useParams } from 'react-router-dom';

function Level3Question({ userId, linkedinUrl, token, resetTimer, discReport }) {

    const headers = {
        authorization: `Bearer ${token}`,
    };
    const { id } = useParams();
    const level3Answer = useSelector((state) => state.gamifiedPsychoSlice.level3QuestionAnswered);
    const [currentIndexLevel3, setCurrentIndexLevel3] = React.useState(0);
    const [level3Question, setLevel2Question] = React.useState([]);
    const [disc, setDisc] = useState(discReport);
    const [isSubmissionLoading, setIsSubmissionLoading] = useState(false);
    const dispatch = useDispatch()

    const {
        handleUpdateMainViewCandidate,
        handleSetVmLiteReportFlag,
    } = usePreEvaluation();

    useEffect(() => {
        fetchLevel3Question()
    }, [userId])

    const fetchLevel3Question = async () => {
        if (userId) {
            const res = await getLevel3Question(userId);
            //console.log("wwhduwdhbewhcbd", res)
            setLevel2Question(res.data.question);
        }
    }

    const level3EndIndex = Math.min(currentIndexLevel3 + 5, level3Question.length);
    const level3QuestionToShow = level3Question.slice(currentIndexLevel3, level3EndIndex);

    function handleSubmitLevel3() {
        if (level3Answer.length === level3Question?.length) {
            const resultObj = {};
            level3Answer.forEach((answer, index) => {
                resultObj[`${index + 1}`] = answer;
            });

            //console.log("level 3 answer: ", resultObj);
            setIsSubmissionLoading(true);

            psycholinguisticsTestLevel3(resultObj, headers)
                .then(async (res) => {
                    //console.log("level 3 result", res);
                    const OCEANScore = extractOCEANScores(res.data);
                    //console.log("OCEANScore============", OCEANScore)
                    const OCEANScoreConfidence = Number(res.data.confidenceScore * 100);
                    //console.log("OCEANScoreConfidence============", OCEANScoreConfidence)
                    const data = {
                        linkedInUrl: linkedinUrl,
                        ocean: {
                            OCEAN_scores: OCEANScore,
                            confidence_score: OCEANScoreConfidence
                        }
                    }

                    saveLevelThreeScore(res.data);
                    const updateddiscData = { data, disc };

                    const inviteres = await getInviteById(id);
                    //console.log("inviters", inviteres?.inviteResponse?.evaluationId)
                    handleUpdateMainViewCandidate(inviteres?.inviteResponse?.evaluationId, {
                        culturalMatch: {
                            ConfidenceScoreCandidate:
                                OCEANScoreConfidence,
                            FlippedMatch: res?.data?.confidenceLevel,
                            ConfidenceScoreCandidateCategory:
                                res?.data?.confidenceLevel,
                        },
                    });

                    updateOCEANInProfile(updateddiscData);
                    handleSetVmLiteReportFlag(inviteres?.inviteResponse?.evaluationId);

                })
                .catch((err) => {
                    setIsSubmissionLoading(false);
                    //console.log("error: level3", err);
                    serverErrorNotification();
                })
        } else {
            notify("Please answer all questions");
        }
    }

    function handleLevel3NextClick() {
        // dispatch(setIsTestFinished(true)) // sample to get to the last screen
        if (level3Answer.length >= 5) {
            if (currentIndexLevel3 + 5 < level3Question.length) {
                //console.log("answer: ", level3Answer)
                setCurrentIndexLevel3(currentIndexLevel3 + 5);
                resetTimer();
            } else if (level3EndIndex === level3Question.length) {
                handleSubmitLevel3();
            }
        } else {
            //console.log("answer: ", level3Answer)
            notify("Please answer all questions");
        }
    }

    async function updateOCEANInProfile(data) {
        const response = await updateOceanScore(data);

        if (response && response.status === 200) {
            setIsSubmissionLoading(false);
            dispatch(setIsTestFinished(true))
        } else {
            notify("Something went wrong!", "error");
            dispatch(setIsTestFinished(true))
        }
    }

    return (
        <div className='flex flex-col flex-grow overflow-y-auto overflow-x-hidden'>
            <div className='flex flex-col p-4 mt-10 md:mt-14 flex-grow space-y-8'>
                <div className='flex flex-col space-y-2 ml-4'>
                    <div className='text-lg ml-2 font-semibold text-black/70'>Indicate for each statement whether it is</div>
                    <ul className='list-decimal ml-8 text-sm font-normal text-black/70'>
                        <li>Very Inaccurate</li>
                        <li>Moderately Inaccurate</li>
                        <li>Neither Accurate Nor Inaccurate</li>
                        <li>Moderately Accurate</li>
                        <li>Very Accurate</li>
                    </ul>
                </div>
                <div className="flex flex-grow flex-col space-y-4 ml-4">
                    {
                        level3QuestionToShow.map((question, index) => (
                            <Level3QuestionItem key={index} question={question} />
                        ))
                    }
                </div>
            </div>
            <div className='flex flex-row items-center justify-center py-4 space-x-4'>
                <div className={`${isSubmissionLoading ? 'opacity-50 hover:cursor-wait' : 'hover:cursor-pointer'} bg-[#228276]  text-white font-semibold px-16 py-2 rounded-md hover:opacity-90`} onClick={handleLevel3NextClick}>
                    {level3EndIndex === level3Question.length ? isSubmissionLoading ? <AiOutlineLoading3Quarters size={20} className='animate-spin ' /> : "Submit" : "Next"}
                </div>
                {/* <div className={` bg-[#228276] text-white font-semibold px-16 py-2 rounded-md hover:opacity-90 hover:cursor-pointer`} onClick={handleLevel3NextClick}>
                    {level3EndIndex === level3Question.length ? "Submit" : "Next"}
                </div> */}
            </div>
        </div>
    )
}

export default Level3Question
