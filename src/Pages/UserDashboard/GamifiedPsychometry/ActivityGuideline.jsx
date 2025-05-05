import React from 'react'

function ActivityGuideline({ onStart }) {

  const guidelines = (
    <div className='w-full h-full flex flex-col justify-start space-y-8 items-start'>
      <div className='flex flex-col w-full space-y-2'>
        <div className='text-base font-medium text-black/70'>
          There are three levels. Complete in one go (10-12 mins) :
        </div>
        <ul className='list-disc list-outside ml-5 text-black/50 text-base flex flex-col space-y-2'>
          <li>Levels 1 & 2 are mandatory for everyone.</li>
          <li>Based on your previous responses, if our algorithm extracts sufficient intelligence about you, it will not initiate Level 3 for you. If this does not happen, Level 3 becomes mandatory.</li>
        </ul>
      </div>

      <div className='flex flex-col w-full space-y-2'>
        <div className='text-base font-medium text-black/70'>
          Level 1
        </div>
        <ul className='list-disc list-outside ml-5 text-black/50 text-base  flex flex-col space-y-2'>
          <li>Text Evaluation &#40;2 questions, Word count - minimum 75 words answer/question, time limit - 5 mins/question&#41;.</li>
          <li>Write freely, our system doesn't assess your vocabulary or grammar.</li>
        </ul>
      </div>

      <div className='flex flex-col w-full space-y-2'>
        <div className='text-base font-medium text-black/70'>
          Level 2
        </div>
        <ul className='list-disc list-outside ml-5 text-black/50 text-base  flex flex-col space-y-2'>
          <li>Picture Choice &#40;3 pictures/screen, 20 seconds/screen&#41;.</li>
          <li>Choose 1 picture per screen that resonates with you.</li>
        </ul>
      </div>

      <div className='flex flex-col w-full space-y-2'>
        <div className='text-base font-medium text-black/70'>
          Level 3
        </div>
        <ul className='list-disc list-outside ml-5 text-black/50 text-base  flex flex-col space-y-2'>
          <li>Additional Self-Insight Questions &#40;10 questions&#41;</li>
        </ul>
      </div>


      <div className='text-lg font-medium text-black/70'>
        {`Relax, be yourself, and enjoy! 👍`}
      </div>

    </div>
  )

  return (

    <div className='flex relative flex-col w-full h-full rounded-md drop-shadow-md bg-white border'>
      <div className='flex justify-between items-center fixed top-0 w-full py-3 md:py-4 px-8 bg-white font-semibold text-lg text-black/80 border-b'>
        <div>Guidelines for the Activity.</div>
        <div className='bg-[#228276] text-white font-semibold px-8 py-1 rounded-md hover:cursor-pointer hover:opacity-90' onClick={onStart}>
          Start
        </div>
      </div>
      <div className='flex flex-col flex-grow overflow-y-auto overflow-x-hidden'>
        <div className='flex flex-col p-4 flex-grow mt-16 space-y-8'>
          <div className='text-lg font-semibold text-black/70'>
            {`The exercise ‘Let the company know more about you’ helps the organization learn more about you. It is not an assessment or test. There are no right or wrong answers, so be yourself and answer quickly.`}
          </div>
          {guidelines}
        </div>
        {/* <div className='flex flex-row items-center justify-center py-4'>
              <div className='bg-[#228276] text-white font-semibold px-10 py-2 rounded-md hover:cursor-pointer hover:opacity-90' onClick={onStart}>
                Start
              </div>
            </div> */}
      </div>
    </div>
  )
}

export default ActivityGuideline