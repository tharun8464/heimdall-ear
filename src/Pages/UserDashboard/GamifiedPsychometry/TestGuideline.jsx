import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

function TestGuideline() {
  const [pageIndex, setPageIndex] = useState(0);
  const { id } = useParams();

  const firstGuidelines = (
    <div className='w-full h-full flex flex-col justify-start space-y-8 items-start'>
      <div className='flex flex-col w-full space-y-2'>
        <div className='text-lg font-semibold text-black/80'>
          Technical Requirements:
        </div>
        <ul className='list-disc list-outside ml-5 text-black/70 text-base flex flex-col space-y-2'>
          <li>Ensure a reliable internet connection with no interruptions and a minimum speed of 20 Mb/s throughout the interview.</li>
          <li>
            Use a laptop/computer system that meets the following minimum system requirements:
            <ul className='list-none ml-5 text-black/70 text-base'>
              <li> - Operating system: Windows 8.1 or higher</li>
              <li> - Processor: Intel Core i3 / AMD Ryzen 3 or higher</li>
              <li> - Memory: 4 GB RAM</li>
              <li> - Device Features: Functional inbuilt camera and microphone. <span className='text-red-500 font-light italic text-sm'>Avoid external cameras.</span></li>
            </ul>
          </li>
        </ul>
      </div>

      <div className='flex flex-col w-full space-y-2'>
        <div className='text-lg font-semibold text-black/80'>
          Testing Environment:
        </div>
        <ul className='list-disc list-outside ml-5 text-black/70 text-base  flex flex-col space-y-2'>
          <li>Find a well-lit and quiet workspace free from distractions. This includes keeping unauthorized materials like books, study guides, or additional electronic devices like extended screens, smart watches, tablets, additional laptops, speaker devices, etc out of the room.</li>
          <li>Ensure you are the only person present in the room during the interview or gamified psychometry.</li>
          <li>Please remove any headgear or accessories, including dark-lens glasses that might obstruct your face, eyes, or ears.</li>
        </ul>
      </div>

      <div className='flex flex-col w-full space-y-2'>
        <div className='text-lg font-semibold text-black/80'>
          Webcam and Microphone Usage:
        </div>
        <ul className='list-disc list-outside ml-5 text-black/70 text-base  flex flex-col space-y-2'>
          <li>Position yourself directly facing your webcam and ensure your entire face and testing area are centered within the frame.</li>
          <li>Keep your microphone on during communication with the platform.</li>
          <li>During proctoring the platform will verify your identity by matching your face to your registration photo.</li>
        </ul>
      </div>
    </div>
  )
  const secondGuidelines = (
    <div className='w-full h-full flex flex-col justify-start space-y-8 items-start'>
      <div className='flex flex-col w-full space-y-2'>
        <div className='text-lg font-semibold text-black/80'>
          Navigating the Session:
        </div>
        <ul className='list-disc list-outside ml-5 text-black/70 text-base flex flex-col space-y-2'>
          <li>By participating, you consent to the interview being recorded for future reference.</li>
          <li>Please follow all platform instructions carefully throughout the session.</li>
          <li>Need help? Contact the support team for any technical assistance.</li>
          <li>Time warnings are reminders to stay on track. Review the interview duration and plan your time wisely.</li>
        </ul>
      </div>

      <div className='flex flex-col w-full space-y-2'>
        <div className='text-lg font-semibold text-black/80'>
          Integrity:
        </div>
        <ul className='list-disc list-outside ml-5 text-black/70 text-base  flex flex-col space-y-2'>
          <li>Maintain integrity and professionalism throughout the interview process.</li>
          <li>Using any dishonest or unethical approach will lead to disqualification from the interview.</li>
        </ul>
      </div>
    </div>
  )

  const guidelines = [firstGuidelines, secondGuidelines]

  function handleClick() {
    if (pageIndex === guidelines.length - 1) {
      handleStart();  // Only call this when the last page is reached.
    } else {
      setPageIndex(prevState => prevState + 1);  // Increment the pageIndex to navigate guidelines.
    }
  }

  function handleStart() {
    window.location.href = `/user/psychometricTest/${id}`;  // This changes the URL for the next page.
  }

  return (
    <div className='w-screen h-screen border py-8 md:py-14 flex justify-center items-center bg-state-100'>
      <div className='flex relative flex-col w-4/5 h-full rounded-md drop-shadow-md bg-white border'>
        <div className='flex justify-between items-center fixed top-0 w-full py-3 md:py-4 px-8 bg-white font-semibold text-lg text-black/80 border-b'>
          <div>Guidelines</div>
          <div className='bg-[#228276] text-white font-semibold px-8 py-1 rounded-md hover:cursor-pointer hover:opacity-90' onClick={handleClick}>
            {pageIndex === guidelines.length - 1 ? 'Start' : 'Next'}
          </div>
        </div>
        <div className='flex flex-col flex-grow overflow-y-auto overflow-x-hidden'>
          <div className='flex flex-col p-4 flex-grow mt-16'>
            {
              guidelines[pageIndex]
            }
          </div>
          {/* <div className='flex flex-row items-center justify-center py-4'>
            <div className='bg-[#228276] text-white font-semibold px-10 py-2 rounded-md hover:cursor-pointer hover:opacity-90' onClick={handleClick}>
              {pageIndex === guidelines.length - 1 ? 'Start' : 'Next'}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default TestGuideline;