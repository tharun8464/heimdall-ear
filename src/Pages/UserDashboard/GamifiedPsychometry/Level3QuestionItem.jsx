import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setLevel3QuestionAnswered } from '../../../Store/slices/gamifiedPsychoSlice';

function Level3QuestionItem({ question }) {
    const dispatch = useDispatch();
    const [answer, setAnswer] = React.useState(null);

    useEffect(() => {
        setAnswer(null);
    }, [question])
    function handleOnChange(index) {
        if (answer !== index) {
            setAnswer(index);
            const answerPayload = {
                id: question._id,
                qsn: question.question,
                qsn_trait: question.questionTrait.charAt(),
                qsn_type: question.questionType,
                qsn_answer: index + 1
            }
            //console.log(answerPayload);
            dispatch(setLevel3QuestionAnswered(answerPayload));
        }
    }

    return (
        <div className='w-full flex flex-col space-y-3'>
            <div className='text-base font-medium text-black/70'>{question.question}</div>
            <div className='flex flex-row space-x-6 items-center'>
                <div className='text-base font-normal text-black/50'>Very Inaccurate</div>
                <div className='flex flex-row space-x-6 items-center'>
                    {
                        Array(5).fill(0).map((_, index) => (
                            <div key={index} onClick={() => handleOnChange(index)} className="w-5 h-5 rounded-full bg-white aspect-square flex justify-center items-center border hover:cursor-pointer">
                                {answer === index && <div className="w-3 h-3 rounded-full bg-green-700 aspect-square flex justify-center items-center" />}
                            </div>
                        ))
                    }
                </div>
                <div className='text-base font-normal text-black/50'>Very Accurate</div>
            </div>
        </div>
    )
}

export default Level3QuestionItem