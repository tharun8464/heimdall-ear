import React, { useState, useEffect } from 'react';
import '../CalenderStyles/datepicker.scss';
import { createJobSchedule, priorityEngine } from '../../../service/api';
import swal from 'sweetalert';

const CandidateInfoTable = ({
  candidates,
  currentPanelXi,
  xi,
  setXi,
  startTime,
  setStartTime,
  highlight,
  showXiSlot,
  setDisableBtn,
  xiSlot,
  setXiSlot,
  slotId,
  setslotId,
  job_id
}) => {
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dates = highlight
      .map(dateStr => {
        let date = new Date(dateStr);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
      })
      .filter(date => new Date(date) >= new Date(today));
    const uniqueDates = [...new Set(dates)];
    setUniqueDates(uniqueDates);
  }, [highlight]);


  const handleCreateSchedule = async (user, interviewerId, startTime, slotId) => {
    const selectedInterviewer = currentPanelXi.find(xi => xi._id === interviewerId);
    const selectedSlot = xiSlot.find(slot => slot._id === slotId?._id);

    const scheduleData = {
      userId: user?.user[0]?._id,
      job_id: job_id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.Email || user.email,
      interviewer: selectedInterviewer ? `${selectedInterviewer.firstName} ${selectedInterviewer.lastname}` : null,
      interviewerId: selectedInterviewer ? selectedInterviewer._id : null,
      date: startTime,
      slot: selectedSlot ? {
        startTime: selectedSlot.startDate,
        endTime: selectedSlot.endDate
      } : null
    };


    // Perform any action with scheduleData, e.g., API call to create schedule
    const res = await createJobSchedule(scheduleData);
    if (res && res?.status === 200) {
      swal({
        title: "Success",
        text: "Schedule created successfully",
        icon: "success",
        button: "OK",
      }).then(() => {
        window.location.reload();
      })
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full my-5">
        {candidates?.filter(user => user.interviewInvited === false).length > 0 ? (
          <thead className="bg-white border-b text-left">
            <tr className="font-bold">
              <th scope="col" className="text-sm text-gray-900 px-6 py-4 text-left">
                Full Name
              </th>
              <th scope="col" className="text-sm text-gray-900 px-6 py-4 text-left">
                Email
              </th>
              <th scope="col" className="text-sm text-gray-900 px-6 py-4 text-left">
                Interviewer
              </th>
              <th scope="col" className="text-sm text-gray-900 px-6 py-4 text-left">
                Date
              </th>
              <th scope="col" className="text-sm text-gray-900 px-6 py-4 text-left">
                Slots
              </th>
              <th scope="col" className="text-sm text-gray-900 px-6 py-4 text-left">
                Action
              </th>
            </tr>
          </thead>
        ) : (null)}
        <tbody>
          {candidates.filter(user => user.interviewInvited === false).map((user, index) => (
            <tr key={user?._id} id={"jobcrd" + (index + 1)} className={"bg-gray-100"}>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                {user.FirstName ? user.FirstName : user.firstName} {user.LastName ? user.LastName : user.lastName}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                {user.Email ? user.Email : user.email}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                <select className="form-control" onChange={(e) => {
                  const selectedValue = e.target.value;
                  setXi(selectedValue);
                  showXiSlot(selectedValue);
                }}>
                  {/* <option value="all">Select</option> */}
                  {currentPanelXi && currentPanelXi.length > 0 ? (
                    currentPanelXi.map((xi) => (
                      <option key={xi?._id} value={xi?._id}>
                        {xi.firstName + " " + xi.lastname}
                      </option>
                    ))
                  ) : (
                    <option>Select</option>
                  )}
                </select>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                <select className="form-control" onChange={(e) => {
                  const selectedValue = e.target.value;
                  setStartTime(new Date(selectedValue));
                }}>
                  {/* <option value="">Select Date</option> */}
                  {uniqueDates && uniqueDates.length > 0 ? (
                    uniqueDates.map((date, index) => (
                      <option key={index} value={date}>
                        {date}
                      </option>
                    ))
                  ) : (
                    <option>Select</option>
                  )}
                </select>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                <select className="form-control" onChange={async (e) => {
                  const selectedSlotId = e.target.value;
                  let priority = await priorityEngine(
                    xiSlot.find((item) => item._id === selectedSlotId).startDate,
                    "XI"
                  );

                  if (priority.status === 200) {
                    setDisableBtn(false);
                  }

                  setslotId(priority.data.slot);
                }}>
                  {/* {xiSlot.length === 0 && (
                    <option value="" disabled selected>
                      No slots available
                    </option>
                  )} */}
                  {xiSlot &&
                    xiSlot.some(item => {
                      return (
                        new Date(item.startDate).getDate() === new Date(startTime).getDate() &&
                        new Date(item.startDate).getMonth() === new Date(startTime).getMonth() &&
                        new Date(item.startDate).getFullYear() === new Date(startTime).getFullYear()
                      );
                    })
                    ? xiSlot.map((item, index) => {
                      if (
                        new Date(item.startDate).getDate() === new Date(startTime).getDate() &&
                        new Date(item.startDate).getMonth() === new Date(startTime).getMonth() &&
                        new Date(item.startDate).getFullYear() === new Date(startTime).getFullYear()
                      ) {
                        const timezoneInfo = '(UTC+5:30)'; // Your timezone information
                        return (
                          <option key={item._id} value={item._id} className={slotId && slotId._id === item._id
                            ? "bg-[#EEEEEE] text-white-600"
                            : "bg-white text-gray-600"
                          }>
                            {`${String(new Date(item.startDate).getHours()).padStart(2, '0')}:${String(new Date(
                              item.startDate
                            ).getMinutes()).padStart(2, '0')} - ${String(new Date(item.endDate).getHours()).padStart(2, '0')}:${String(new Date(
                              item.endDate
                            ).getMinutes()).padStart(2, '0')} ${'\u00A0\u00A0' /* Non-breaking space */}${timezoneInfo}`}
                          </option>
                        );
                      }
                      return null; // If no matching slots, return null to skip rendering this option
                    })
                    : (
                      <option disabled selected>
                        Select
                      </option>
                    )}
                </select>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                {user.interviewInvited === false && (
                  <button
                    className="hover:bg-[#228276] focus:outline-none bg-[#228276] rounded-lg px-[10px] py-2 text-white font-500"
                    onClick={() => handleCreateSchedule(user, xi, startTime, slotId)}
                  >
                    Create Schedule
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CandidateInfoTable;