import React, { useEffect, useState } from 'react'
import ImageSlider from './ImageSlider';
import { ImageOptions } from './ImageOptions';
import { getInviteById, getLevel2Question, updateOceanScore } from '../../../service/api';
import { useDispatch } from 'react-redux';
import { setIsTestFinished } from '../../../Store/slices/gamifiedPsychoSlice';
import { notify } from '../../../utils/notify';
import { extractOCEANScores } from '../../../utils/util';
import usePreEvaluation from '../../../Hooks/usePreEvaluation';
import { useParams } from 'react-router-dom';

const MIN_HIGH_CONFIDENCE = 0.60;
const MIN_MEDIUM_CONFIDENCE = 0.40;
const MIN_HIGH_OCEAN_SCORE = 6.51;
const MIN_MEDIUM_OCEAN_SCORE = 4.01;


const MIN_HIGH_DOMINANCE = 7.91;
const MIN_MEDIUM_DOMINANCE = 6.63;
const MIN_LOW_DOMINANCE = 4.07;

const MIN_HIGH_INFLUENCE = 7.29;
const MIN_MEDIUM_INFLUENCE = 5.91;
const MIN_LOW_INFLUENCE = 3.15;

const MIN_HIGH_STEADINESS = 8.8;
const MIN_MEDIUM_STEADINESS = 7.22;
const MIN_LOW_STEADINESS = 4.06;

const MIN_HIGH_CALC = 10.33;
const MIN_MEDIUM_CALC = 8.85;
const MIN_LOW_CALC = 5.95;



const Report = {
    "OCEAN_scores": {
        "Agreeableness": {
            "confidence": 0.93,
            "level": "High+",
            "score": 4.0,
            "trait_confidance_level": "High+"
        },
        "Conscientiousness": {
            "confidence": 1.0,
            "level": "High+",
            "score": 6.1,
            "trait_confidance_level": "High+"
        },
        "Extraversion": {
            "confidence": 0.91,
            "level": "High+",
            "score": 4.0,
            "trait_confidance_level": "High+"
        },
        "Neuroticism": {
            "confidence": 0.76,
            "level": "High+",
            "score": 3.3,
            "trait_confidance_level": "High"
        },
        "Openness": {
            "confidence": 1.0,
            "level": "High+",
            "score": 6.4,
            "trait_confidance_level": "High+"
        }
    },
    "confidence_level": "High+",
    "confidence_score": 0.92
}



function Level2Question({ level1Report, userId, linkedinUrl, setLevel, resetTimer, onFinish, setDiscReport }) {
    const [showLevel2ImageSlide, setShowLevel2ImageSlide] = useState(true);
    const [isLevel2SlideReplayed, setIsLevel2SlideReplayed] = useState(false);
    const [oceanType, setOceanType] = useState(null);
    const [level2Answer, setLevel2Answer] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [level2Question, setLevel2Question] = useState(null);
    const [lastQuestionType, setLastQuestionType] = useState(null);
    const [numberOfQuestion, setNumberOfQuestion] = useState(1);
    const [level2ReportData, setLevel2ReportData] = useState(level1Report);
    const [showLevel3, setShowLevel3] = useState(false);
    const [level2Finished, setLevel2Finished] = useState(false);
    const [newScore, setNewScore] = useState(0);
    const [wrongAnswerAttempts, setWrongAnswerAttempts] = useState(0);
    const [discDominance, setDiscDominance] = useState(0);
    const [discI, setDiscI] = useState(0);
    const [discS, setDiscS] = useState(0);
    const [discC, setDiscC] = useState(0);
    const [discDO, setDiscDO] = useState(0);
    const [discIO, setDiscIO] = useState(0);
    const [discSO, setDiscSO] = useState(0);
    const [discCO, setDiscCO] = useState(0);
    const [discDominanceCount, setDiscDominanceCount] = useState(0);
    const [discInfluenceCount, setDiscInfluenceCount] = useState(0);
    const [discSteadinessCount, setDiscSteadinessCount] = useState(0);
    const [discCalculativenessCount, setDiscCalculativenessCount] = useState(0);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [imageOptions, setImageOptions] = useState([]);
    const {
        handleUpdateMainViewCandidate,
        handleSetVmLiteReportFlag,
    } = usePreEvaluation();

    useEffect(() => {
        fetchLevel2Question();
        //console.log("level 1 Report: ", level1Report);
        //console.log(extractOCEANScores(level2ReportData));
    }, [userId]);

    useEffect(() => {
        const initial = async () => {
            if (level2Finished) {
                //console.log("level 2 Report: ", level2ReportData);
                //console.log("Dominance", getDLabel(discDominance))
                const disc = {
                    details: [
                        getDLabel(discDominance),
                        getILabel(discI),
                        getSLabel(discS),
                        getCLabel(discC),
                    ],
                };
                //console.log("dddddiiiii", disc)
                if (showLevel3) {
                    setDiscReport(disc);
                    onFinish();
                } else {
                    const OCEANScore = extractOCEANScores(level2ReportData);
                    const OCEANScoreConfidence = Number(level2ReportData.confidenceScore * 100);
                    const data = {
                        linkedInUrl: linkedinUrl,
                        ocean: {
                            OCEAN_scores: OCEANScore,
                            confidence_score: OCEANScoreConfidence
                        }
                    };
                    const updateddiscData = { data, disc };
                    //console.log("92=======================", data);
                    const inviteres = await getInviteById(id);
                    //console.log("inviters", inviteres?.inviteResponse?.evaluationId)
                    handleUpdateMainViewCandidate(inviteres?.inviteResponse?.evaluationId, {
                        culturalMatch: {
                            ConfidenceScoreCandidate:
                                OCEANScoreConfidence,
                            FlippedMatch: level2ReportData?.confidenceLevel,
                            ConfidenceScoreCandidateCategory:
                                level2ReportData?.confidenceLevel,
                        },
                    });

                    await updateOCEANInProfile(updateddiscData);
                    handleSetVmLiteReportFlag(inviteres?.inviteResponse?.evaluationId);
                    //console.log("95=======================end");
                }
            }
        };
        initial();
    }, [showLevel3, level2Finished]);


    const getDLabel = discLabel => {
        discLabel = (((discLabel) / 9) * 10).toFixed(2)
        if (discLabel > MIN_HIGH_DOMINANCE) {
            return { score: discLabel, level: "high+", label: "dominance" };
        }
        if (discLabel >= MIN_MEDIUM_DOMINANCE && discLabel <= MIN_HIGH_DOMINANCE) {
            return { score: discLabel, level: "high", label: "dominance" };
        }
        if (discLabel >= MIN_LOW_DOMINANCE && discLabel < MIN_MEDIUM_DOMINANCE) {
            return { score: discLabel, level: "medium", label: "dominance" };
        }
        if (discLabel < MIN_LOW_DOMINANCE) {
            return { score: discLabel, level: "low", label: "dominance" };
        }
    };

    const getILabel = discLabel => {
        discLabel = (((discLabel) / 9) * 10).toFixed(2)
        if (discLabel > MIN_HIGH_INFLUENCE) {
            return { score: discLabel, level: "high+", label: "influence" };
        }
        if (discLabel >= MIN_MEDIUM_INFLUENCE && discLabel <= MIN_HIGH_INFLUENCE) {
            return { score: discLabel, level: "high", label: "influence" };
        }
        if (discLabel >= MIN_LOW_INFLUENCE && discLabel < MIN_MEDIUM_INFLUENCE) {
            return { score: discLabel, level: "medium", label: "influence" };
        }
        if (discLabel < MIN_LOW_INFLUENCE) {
            return { score: discLabel, level: "low", label: "influence" };
        }
    };

    const getSLabel = discLabel => {
        discLabel = (((discLabel) / 9) * 10).toFixed(2)
        if (discLabel > MIN_HIGH_STEADINESS) {
            return { score: discLabel, level: "high+", label: "steadiness" };
        }
        if (discLabel >= MIN_MEDIUM_STEADINESS && discLabel <= MIN_HIGH_STEADINESS) {
            return { score: discLabel, level: "high", label: "steadiness" };
        }
        if (discLabel >= MIN_LOW_STEADINESS && discLabel < MIN_MEDIUM_STEADINESS) {
            return { score: discLabel, level: "medium", label: "steadiness" };
        }
        if (discLabel < MIN_LOW_STEADINESS) {
            return { score: discLabel, level: "low", label: "steadiness" };
        }
    };

    const getCLabel = discLabel => {
        discLabel = (((discLabel) / 9) * 10).toFixed(2)
        if (discLabel > MIN_HIGH_CALC) {
            return { score: discLabel, level: "high+", label: "compliance" };
        }
        if (discLabel >= MIN_MEDIUM_CALC && discLabel <= MIN_HIGH_CALC) {
            return { score: discLabel, level: "high", label: "compliance" };
        }
        if (discLabel >= MIN_LOW_CALC && discLabel < MIN_MEDIUM_CALC) {
            return { score: discLabel, level: "medium", label: "compliance" };
        }
        if (discLabel < MIN_LOW_CALC) {
            return { score: discLabel, level: "low", label: "compliance" };
        }
    };

    const fetchLevel2Question = async () => {
        //console.log("fetch level 2 question: ", userId);
        if (userId) {
            const res = await getLevel2Question(userId);
            //console.log("level 2 question: ", res.data.question);
            setLevel2Question(res.data.question);
            setOceanType(Object.keys(res.data.question)[0]);

            const lastType = Object.keys(res.data.question)[Object.keys(res.data.question).length - 1];
            setLastQuestionType(lastType);

            const firstQuestionImageOptions = res.data.question[Object.keys(res.data.question)[0]][0].imageOptions;
            setImageOptions(firstQuestionImageOptions);

            preloadImages(firstQuestionImageOptions);
        }
    };

    const preloadImages = (images) => {
        images.forEach((image) => {
            const img = new Image();
            img.src = image;
        });
    };

    useEffect(() => {
        if (imageOptions && imageOptions.length > 0) {
            preloadImages(imageOptions);
        }
    }, [imageOptions]);

    async function updateOCEANInProfile(data) {
        const response = await updateOceanScore(data);
        //console.log("response===========", response);
        if (response && response.status === 200) {
            dispatch(setIsTestFinished(true));
        } else {
            notify("Something went wrong!", "error");
            dispatch(setIsTestFinished(true));
        }
    }

    function handleSubmitLevel2() {
        if (level2Answer) {
            //console.log("level 2 answer: ", level2Answer);
            handelQuestionChange();
        }
    }

    function handleLevel2Replay() {
        if (!isLevel2SlideReplayed) {
            setIsLevel2SlideReplayed(!isLevel2SlideReplayed);
            setShowLevel2ImageSlide(!showLevel2ImageSlide);
            resetTimer();
        }
    }

    function handleOnSlideComplete() {
        setShowLevel2ImageSlide(!showLevel2ImageSlide);
    }

    function getOceanScoreRange(score) {
        //console.log("score", score >= MIN_HIGH_OCEAN_SCORE);
        if (score >= MIN_HIGH_OCEAN_SCORE) {
            return 3; // high
        } else if (score >= MIN_MEDIUM_OCEAN_SCORE && score < MIN_HIGH_OCEAN_SCORE) {
            return 2; // medium
        } else {
            return 1; // low
        }
    }

    function updateConfidence(key, confidence) {
        setLevel2ReportData({
            ...level2ReportData,
            OCEAN_scores: {
                ...level2ReportData.OCEAN_scores,
                [key]: {
                    ...level2ReportData.OCEAN_scores[key],
                    confidence: confidence
                }
            }
        });
    }

    function updateScore(key, score) {
        setLevel2ReportData({
            ...level2ReportData,
            OCEAN_scores: {
                ...level2ReportData.OCEAN_scores,
                [key]: {
                    ...level2ReportData.OCEAN_scores[key],
                    score: score
                }
            }
        });
    }

    function handelQuestionChange() {
        //console.log("handling question change");

        const OCEANScore = level2Question[oceanType][currentQuestion].Ocean ? level2ReportData.OCEAN_scores[oceanType].score : "";
        const discsTrait = level2Question[oceanType][currentQuestion].Disc ? level2Question[oceanType][currentQuestion].discTrait : "";
        const OCEANScoreConfidence = level2Question[oceanType][currentQuestion].Ocean ? Number(level2ReportData.OCEAN_scores[oceanType].confidence) : "";
        //console.log("typeofocean", typeof (OCEANScoreConfidence), OCEANScoreConfidence)
        //console.log("currentQuestion>>>>>>>>>>>>>>>>>>", currentQuestion)
        //console.log("level2Question[oceanType].length<<<<<<<<<<<<<<<<<", level2Question[oceanType].length)
        const isLastQuestion = currentQuestion === level2Question[oceanType].length - 1;
        //console.log("OCEANScoreConfidence>>>>>>>", OCEANScoreConfidence)
        //console.log("MIN_HIGH_CONFIDENCE??????", MIN_HIGH_CONFIDENCE)
        //console.log("level2Answer:::", level2Answer)
        //console.log("isLastQuestion===========", isLastQuestion)
        //console.log("isLastQuestion===========", lastQuestionType)
        //console.log("oceanType===========", oceanType)
        //console.log("wwwwwwrrrrrr", wrongAnswerAttempts)
        //console.log("dcounttttt", discDominanceCount)
        //console.log("dcount", discDO)
        //console.log("icount", discIO)
        //console.log("icounttttt", discInfluenceCount)
        //console.log("scounttttt", discSteadinessCount)
        //console.log("ccounttttt", discCalculativenessCount)
        //console.log("ccount", discCO)

        if (level2Question[oceanType][currentQuestion].Disc && level2Question[oceanType][currentQuestion].Ocean) {
            if (level2Question[oceanType][currentQuestion].discTrait === "Dominance") {

                setDiscDO(prevCount => prevCount + 1);

            } else if (level2Question[oceanType][currentQuestion].discTrait === "Influence") {

                setDiscIO(prevCount => prevCount + 1);

            } else if (level2Question[oceanType][currentQuestion].discTrait === "Steadiness") {
                setDiscSO(prevCount => prevCount + 1);
            } else {
                setDiscCO(prevCount => prevCount + 1);
            }
        }



        if (level2Question[oceanType][currentQuestion].Disc) {
            //console.log("dddddddddddddddd", discDO)
            if (level2Question[oceanType][currentQuestion].discTrait === "Dominance") {
                setDiscDominance(prev => prev + level2Answer);
                setDiscDominanceCount(prevCount => prevCount + 1);
                if (discDominanceCount + 1 === 3 && discDO + 1 === 2) {
                    //console.log("skippedddddddddddddddd")
                    setCurrentQuestion((currentQuestion + 2) % level2Question[oceanType].length);
                    setNumberOfQuestion(prev => prev + 1);
                    setShowLevel2ImageSlide(true);
                    setIsLevel2SlideReplayed(false);
                    setLevel2Answer(null);
                    resetTimer();
                    return; // Skip the rest of the function
                }
            } else if (level2Question[oceanType][currentQuestion].discTrait === "Influence") {
                setDiscI(prev => prev + level2Answer);
                setDiscInfluenceCount(prevCount => prevCount + 1);
                if (discInfluenceCount + 1 === 3 && discIO + 1 === 2) {
                    setCurrentQuestion((currentQuestion + 2) % level2Question[oceanType].length);
                    setNumberOfQuestion(prev => prev + 1);
                    setShowLevel2ImageSlide(true);
                    setIsLevel2SlideReplayed(false);
                    setLevel2Answer(null);
                    resetTimer();
                    return; // Skip the rest of the function
                }
            } else if (level2Question[oceanType][currentQuestion].discTrait === "Steadiness") {
                setDiscS(prev => prev + level2Answer);
                setDiscSteadinessCount(prevCount => prevCount + 1);

                if (discSteadinessCount + 1 === 3 && discSO + 1 === 2) {
                    setCurrentQuestion((currentQuestion + 2) % level2Question[oceanType].length);
                    setNumberOfQuestion(prev => prev + 1);
                    setShowLevel2ImageSlide(true);
                    setIsLevel2SlideReplayed(false);
                    setLevel2Answer(null);
                    resetTimer();
                    return; // Skip the rest of the function
                }
            } else {
                setDiscC(prev => prev + level2Answer);
                setDiscCalculativenessCount(prevCount => prevCount + 1);

                if (discCalculativenessCount + 1 === 3 && discCO + 1 === 2) {
                    setCurrentQuestion((currentQuestion + 2) % level2Question[oceanType].length);
                    setNumberOfQuestion(prev => prev + 1);
                    setShowLevel2ImageSlide(true);
                    setIsLevel2SlideReplayed(false);
                    setLevel2Answer(null);
                    setLevel2Finished(true);
                    resetTimer();
                    return; // Skip the rest of the function
                }
            }
        }

        if (level2Question[oceanType][currentQuestion].Ocean) {
            if (OCEANScoreConfidence > MIN_HIGH_CONFIDENCE) {
                // for high confidence
                //console.log("high confidence", getOceanScoreRange(OCEANScore));
                if (level2Answer === getOceanScoreRange(OCEANScore)) {
                    if (wrongAnswerAttempts === 1) {
                        //console.log("high confidence correct answer first");
                        setCurrentQuestion((currentQuestion + 1) % level2Question[oceanType].length);
                        setWrongAnswerAttempts(0);
                    } else if (lastQuestionType === oceanType) {
                        //console.log("high confidence correct answer");
                        //console.log("last question answered");
                        //console.log("report: ", level2ReportData);
                        setWrongAnswerAttempts(0);
                        setLevel2Finished(true);
                    } else {
                        //console.log("high confidence correct answer 1");
                        const updatedConfidence = (OCEANScoreConfidence + 0.10).toFixed(2);
                        updateConfidence(oceanType, updatedConfidence);
                        const nextOCEANTypeIndex = (Object.keys(level2Question).indexOf(oceanType) + 1) % Object.keys(level2Question).length;
                        setOceanType(Object.keys(level2Question)[nextOCEANTypeIndex]);
                        setCurrentQuestion(0);
                        setWrongAnswerAttempts(0); // reset the wrong answer attempts
                    }
                } else if (isLastQuestion) {
                    if (lastQuestionType === oceanType) {
                        //console.log("high confidence wrong answer");
                        //console.log("last question answered");
                        //console.log("report: ", level2ReportData);

                        setShowLevel3(true);
                        setLevel2Finished(true);

                        const oceanTypes = Object.keys(level2Question);
                        const currentIndex = oceanTypes.indexOf(oceanType);
                        const lastOCEANTypeIndex = oceanTypes.length - 1;
                        setOceanType(oceanTypes[lastOCEANTypeIndex]);
                    } else {
                        //console.log("high confidence wrong answer");
                        const nextOCEANTypeIndex = (Object.keys(level2Question).indexOf(oceanType) + 1) % Object.keys(level2Question).length;
                        setOceanType(Object.keys(level2Question)[nextOCEANTypeIndex]);
                        setCurrentQuestion(0);
                        setShowLevel3(true);
                        const oceanTypes = Object.keys(level2Question);
                        const currentIndex = oceanTypes.indexOf(oceanType);
                        const lastOCEANTypeIndex = oceanTypes.length - 1;
                        setOceanType(oceanTypes[lastOCEANTypeIndex]);

                    }
                } else {
                    //console.log("high confidence wrong answer");
                    setWrongAnswerAttempts((prevAttempts) => {
                        if (prevAttempts === 0) {
                            setCurrentQuestion((currentQuestion + 1) % level2Question[oceanType].length);
                            return 1;
                        } else {
                            setShowLevel3(true);
                            const oceanTypes = Object.keys(level2Question);
                            const currentIndex = oceanTypes.indexOf(oceanType);
                            const lastOCEANTypeIndex = oceanTypes.length - 1;
                            setOceanType(oceanTypes[lastOCEANTypeIndex]);
                            setCurrentQuestion(0);
                            //console.log("current question", currentQuestion)
                            //console.log("curreeeeee")
                            return 0;
                        }
                    });

                }
            } else if (OCEANScoreConfidence > MIN_MEDIUM_CONFIDENCE                          // for medium confidence
                && OCEANScoreConfidence < MIN_HIGH_CONFIDENCE) {
                //console.log("medium confidence");
                if (isLastQuestion) {
                    if (level2Answer === getOceanScoreRange(OCEANScore)) {
                        // increase confidence by 10%
                        //console.log("medium confidence correct answer");
                        const updatedConfidence = (OCEANScoreConfidence + 0.10).toFixed(2);
                        updateConfidence(oceanType, updatedConfidence);
                        const nextOCEANTypeIndex = (Object.keys(level2Question).indexOf(oceanType) + 1) % Object.keys(level2Question).length;
                        setOceanType(Object.keys(level2Question)[nextOCEANTypeIndex]);
                        setCurrentQuestion(0);
                    } else {
                        // decrease confidence by 10%
                        //console.log("medium confidence wrong answer");
                        // setShowLevel3(true);
                        // setLevel2Finished(true);
                        // go to level3 without calculation
                        // const updatedConfidence = (OCEANScoreConfidence - 0.10).toFixed(2);
                        // updateConfidence(oceanType, updatedConfidence);
                        const nextOCEANTypeIndex = (Object.keys(level2Question).indexOf(oceanType) + 1) % Object.keys(level2Question).length;
                        setOceanType(Object.keys(level2Question)[nextOCEANTypeIndex]);
                        setCurrentQuestion(0);
                    }

                    const currentConfidence = level2ReportData.OCEAN_scores[oceanType].confidence;
                    //console.log("current confidence: ", currentConfidence);
                    if (currentConfidence < MIN_HIGH_CONFIDENCE) {
                        if (lastQuestionType === oceanType) {
                            //console.log("report: ", level2ReportData);

                            setShowLevel3(true);
                            setLevel2Finished(true);
                            const oceanTypes = Object.keys(level2Question);
                            const currentIndex = oceanTypes.indexOf(oceanType);
                            const lastOCEANTypeIndex = oceanTypes.length - 1;
                            setOceanType(oceanTypes[lastOCEANTypeIndex]);
                        } else {
                            setShowLevel3(true);
                            const oceanTypes = Object.keys(level2Question);
                            const currentIndex = oceanTypes.indexOf(oceanType);
                            const lastOCEANTypeIndex = oceanTypes.length - 1;
                            setOceanType(oceanTypes[lastOCEANTypeIndex]);
                        }
                    } else {
                        if (lastQuestionType === oceanType) {
                            //console.log("report: ", level2ReportData);

                            setLevel2Finished(true);
                        }
                    }

                } else {
                    if (level2Answer === getOceanScoreRange(OCEANScore)) {
                        // increase confidence by 10%
                        //console.log("medium confidence correct answer");
                        const updatedConfidence = (OCEANScoreConfidence + 0.10).toFixed(2);
                        updateConfidence(oceanType, updatedConfidence);
                        setCurrentQuestion((currentQuestion + 1) % level2Question[oceanType].length);
                    } else {
                        // decrease confidence by 10%
                        //console.log("medium confidence wrong answer");
                        // const updatedConfidence = (OCEANScoreConfidence - 0.10).toFixed(2);
                        // updateConfidence(oceanType, updatedConfidence);
                        setCurrentQuestion((currentQuestion + 1) % level2Question[oceanType].length);
                    }
                }

            } else {                                                                        // for low confidence
                //console.log("low confidence");
                if (isLastQuestion) {
                    const score = (((newScore + level2Answer) / 9) * 10).toFixed(1);
                    updateScore(oceanType, score);
                    if (lastQuestionType === oceanType) {
                        //console.log("last question answered");
                        //console.log("report: ", level2ReportData);

                        setShowLevel3(true);
                        setLevel2Finished(true);
                        const oceanTypes = Object.keys(level2Question);
                        const currentIndex = oceanTypes.indexOf(oceanType);
                        const lastOCEANTypeIndex = oceanTypes.length - 1;
                        setOceanType(oceanTypes[lastOCEANTypeIndex]);
                    } else {
                        const nextOCEANTypeIndex = (Object.keys(level2Question).indexOf(oceanType) + 1) % Object.keys(level2Question).length;
                        setOceanType(Object.keys(level2Question)[nextOCEANTypeIndex]);
                        setCurrentQuestion(0);
                    }
                } else {
                    setNewScore(prev => prev + level2Answer);
                    setCurrentQuestion((currentQuestion + 1) % level2Question[oceanType].length);
                }
            }
        } else {
            if (isLastQuestion) {
                setLevel2Finished(true);
            }
            else {
                setCurrentQuestion((currentQuestion + 1) % level2Question[oceanType].length);
            }

        }

        setNumberOfQuestion(prev => prev + 1);
        setImageOptions(level2Question[oceanType][currentQuestion]?.imageOptions);
        setShowLevel2ImageSlide(true);
        setIsLevel2SlideReplayed(false);
        setLevel2Answer(null);
        resetTimer();
    }



    return (
        <div className='flex flex-col flex-grow overflow-y-auto overflow-x-hidden'>
            {level2Question &&
                <div className='flex flex-col p-4 mt-16 flex-grow space-y-8'>
                    <div className='text-lg md:pl-2 flex font-semibold text-black/70'>
                        {`Question ${numberOfQuestion && numberOfQuestion}. ${level2Question[oceanType][currentQuestion]?.question}`}
                    </div>
                    <div className='flex flex-col flex-grow space-y-2'>
                        {
                            showLevel2ImageSlide
                                ? <ImageSlider images={level2Question[oceanType][currentQuestion]?.imageOptions} onComplete={handleOnSlideComplete} />
                                : <ImageOptions images={level2Question[oceanType][currentQuestion]?.imageOptions} onSelect={setLevel2Answer} select={level2Answer} />
                        }
                    </div>
                </div>
            }
            <div className='flex flex-row items-center justify-center py-4 space-x-4'>
                {
                    !showLevel2ImageSlide && <div className='flex flex-row space-x-4 w-full justify-center items-center'>
                        <div className={`${isLevel2SlideReplayed ? 'bg-[#B3B3B3] hover:cursor-not-allowed' : 'bg-[#228276] hover:cursor-pointer hover:opacity-90'} text-white font-semibold px-16 py-2 rounded-md`} onClick={handleLevel2Replay}>
                            Replay
                        </div>
                        <div className={`${level2Answer ? 'bg-[#228276] hover:cursor-pointer hover:opacity-90' : 'bg-[#B3B3B3] hover:cursor-not-allowed'} text-white font-semibold px-16 py-2 rounded-md`} onClick={handleSubmitLevel2}>
                            Next
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Level2Question;
