import React from 'react';

export const BookedSlotCard = ({ item }) => {

    const calculateTimeGap = (startDateString) => {
        const startDate = new Date(startDateString);
        const now = new Date(); // Current time in UTC

        // Adjust the current time to IST (UTC+5:30)
        const nowIST = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));

        // Calculate the difference in milliseconds
        const differenceInMs = nowIST.getTime() - startDate.getTime();
        // Convert milliseconds to hours and minutes
        const differenceInHours = Math.floor(Math.abs(differenceInMs) / (1000 * 60 * 60));
        const differenceInMinutes = Math.floor((Math.abs(differenceInMs) % (1000 * 60 * 60)) / (1000 * 60));

        // Determine if the time gap is in the past or future
        const timeDescription = differenceInMs > 0
            ? `${differenceInHours > 0 ? differenceInHours + ' hrs ' : ''}${differenceInMinutes} mins ago`
            : `in ${differenceInHours > 0 ? differenceInHours + ' hrs ' : ''}${differenceInMinutes} mins`;

        return timeDescription;

    }

    return (
        <div className="flex flex-row justify-between align-middle px-3 py-3 my-2 bg-white drop-shadow-md rounded-lg">
            <div>
                <h2 className='font-bold'>
                    {new Date(item?.startDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })} -
                    {new Date(item?.endDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}
                </h2>

                <p className='text-gray-400'>{item?.slotName}</p>
            </div>
            <div className='pt-2 text-[#228276] font-medium'>
                {calculateTimeGap(item?.startDate)}
                {/* {(() => {
                    const now = new Date();
                    const startDate = new Date(item?.startDate);

                    const differenceInMilliseconds = startDate - now;
                    const differenceInMinutes = Math.floor(differenceInMilliseconds / 60000);
                    const differenceInHours = Math.floor(differenceInMinutes / 60);
                    const remainingMinutes = differenceInMinutes % 60;

                    if (differenceInMilliseconds < 0) {
                        // Time has passed
                        const absDifferenceInMinutes = Math.abs(differenceInMinutes);
                        const absDifferenceInHours = Math.floor(absDifferenceInMinutes / 60);
                        const absRemainingMinutes = absDifferenceInMinutes % 60;

                        if (absDifferenceInMinutes < 60) {
                            return `${absRemainingMinutes} minutes ago`;
                        } else if (absRemainingMinutes === 0) {
                            return `${absDifferenceInHours} hours ago`;
                        } else {
                            return `${absDifferenceInHours} hours ago`;
                        }
                    } else {
                        // Time is in the future
                        if (differenceInMinutes < 60) {
                            return `in ${remainingMinutes} minutes`;
                        } else if (remainingMinutes === 0) {
                            return `in ${differenceInHours} hours`;
                        } else {
                            return `in ${differenceInHours} hours`;
                        }
                    }
                })()} */}
            </div>
        </div>
    )
}