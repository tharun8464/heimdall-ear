import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";




export default function ExportReportModal({ isOpen, closeModal, jobsData }) {
  const { activeJobs, notAcceptingJobs, closedJobs } = jobsData;
  // State for the new Schedule Email popup
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isScheduledModalOpen, setisScheduledModalOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);

  // List of fields with corresponding keys and preselection logic
  const fields = [
    { label: "Candidate Interview Statistics", key: "activeJobs", value: activeJobs },
    { label: "Candidate Cognitive Games Statistics", key: "notAcceptingJobs", value: notAcceptingJobs },
    { label: "Job Notification", key: "closedJobs", value: closedJobs },
    // Add more fields as needed
  ];

  // Preselect checkboxes based on jobsData when modal opens
  useEffect(() => {
    if (jobsData) {
      const preselectedFields = fields
        .filter(({ value }) => value) // Include fields where value exists
        .map(({ key }) => key); // Extract keys of preselected fields
      setSelectedFields(preselectedFields);
    }
  }, [jobsData]);

  // Handle checkbox changes
  const handleCheckboxChange = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key)
        ? prev.filter((field) => field !== key) // Remove from selection
        : [...prev, key] // Add to selection
    );
  };

  // Handle Export button click
  const handleExport = () => {
    const selectedValues = fields.filter(({ key }) => selectedFields.includes(key));

    if (!selectedValues.length) {
      alert("Please select at least one field to export.");
      return;
    }

    // Generate CSV content
    const csvRows = [["Field", "Value"]]; // CSV header
    selectedValues.forEach(({ label, value }) => {
      csvRows.push([label, value || "N/A"]); // Add each field and value
    });

    // Convert rows to CSV string
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [ccEmails, setCcEmails] = useState([]);
  const [ccEmailInput, setCcEmailInput] = useState("");

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState("never");
  const [selectedDate, setSelectedDate] = useState("");
  const [occurrences, setOccurrences] = useState(1);
  const [selectedInterval, setSelectedInterval] = useState("week");

  const handleEmailChange = e => {
    setEmailInput(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const addEmail = () => {
    if (emailInput.trim() && validateEmail(emailInput)) {
      setEmails([...emails, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const validateEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const removeEmail = index => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleCcEmailChange = e => {
    setCcEmailInput(e.target.value);
  };

  const handleCcKeyDown = e => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCcEmail();
    }
  };

  const addCcEmail = () => {
    if (ccEmailInput.trim() && validateEmail(ccEmailInput)) {
      setCcEmails([...ccEmails, ccEmailInput.trim()]);
      setCcEmailInput("");
    }
  };

  const removeCcEmail = index => {
    const newCcEmails = ccEmails.filter((_, i) => i !== index);
    setCcEmails(newCcEmails);
  };
  const toggleDay = index => {
    setSelectedDay(index);
  };

  const openScheduleModal = () => {
    closeModal();
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };

  const openConfirmationModal = () => {
    closeScheduleModal();
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => setIsConfirmationModalOpen(false);

  function submitConfirmationModal() {
    // Create schedule data object
    const scheduleData = {
      toEmails: emails,
      ccEmails: ccEmails,
      exportFields: selectedFields,
      repeatEvery: {
        number: document.getElementById('weekNumberInput').value,
        interval: selectedInterval
      },
      repeatOn: selectedInterval === 'week'
        ? { selectedDay }
        : { selectedDate },
      endSchedule: {
        type: selectedOption,
        endDate: selectedOption === 'on' ? selectedEndDate : null,
        occurrences: selectedOption === 'after' ? occurrences : null
      },
      exportFormat: document.querySelector('#component5 select').value
    };



    closeConfirmationModal();
    setisScheduledModalOpen(true);
  }

  function closeScheduledModal() {

    setisScheduledModalOpen(false);
  }

  const handleSaveSchedule = () => {
    // Validate required fields before proceeding
    if (!emails.length) {
      alert('Please add at least one recipient email');
      return;
    }

    if (!selectedFields.length) {
      alert('Please select at least one field to export');
      return;
    }

    const intervalNumber = document.getElementById('weekNumberInput').value;
    if (!intervalNumber || intervalNumber < 1) {
      alert('Please enter a valid interval number');
      return;
    }

    if (selectedInterval === 'week' && selectedDay === null) {
      alert('Please select a day of the week');
      return;
    }

    if ((selectedInterval === 'month' || selectedInterval === 'year') && !selectedDate) {
      alert('Please select a date');
      return;
    }

    // Create schedule data object
    const scheduleData = {
      toEmails: emails,
      ccEmails: ccEmails,
      exportFields: selectedFields,
      repeatEvery: {
        number: intervalNumber,
        interval: selectedInterval
      },
      repeatOn: selectedInterval === 'week'
        ? { selectedDay }
        : { selectedDate },
      endSchedule: {
        type: selectedOption,
        endDate: selectedOption === 'on' ? selectedEndDate : null,
        occurrences: selectedOption === 'after' ? occurrences : null
      },
      exportFormat: document.querySelector('#component5 select').value
    };



    // Open the confirmation modal
    openConfirmationModal();
  };

  return (
    <>
      {/* Original Export Report Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-[800px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900">
                    Export Report
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-4">
                    Select fields for export and export once or schedule an email
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {/* Render checkboxes dynamically */}
                      {fields.map(({ label, key }) => (
                        <div key={key}>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-green-600"
                              checked={selectedFields.includes(key)}
                              onChange={() => handleCheckboxChange(key)}
                            />
                            <span className="ml-2 text-gray-700">{label}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="text-md font-semibold">Existing Schedule</h4>
                      <div className="bg-gray-100 p-4 rounded-md space-y-3">
                        {/* Example schedule items */}
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p>To: xyz@abc.com</p>
                          <p>Cc: xyz@abc.com</p>
                          <p>1 week, Monday - Ends on: Never</p>
                          <div className="flex justify-end space-x-2 mt-2">
                            <button className="text-red-500">Delete</button>
                            <button className="text-blue-500">Edit</button>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p>To: xyz@abc.com</p>
                          <p>Cc: xyz@abc.com</p>
                          <p>1 week, Monday - Ends on: Never</p>
                          <div className="flex justify-end space-x-2 mt-2">
                            <button className="text-red-500">Delete</button>
                            <button className="text-blue-500">Edit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                      onClick={handleExport}
                    >
                      Export Once
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                      onClick={openScheduleModal} // Open Schedule Modal on click
                    >
                      Schedule Email
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isScheduleModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeScheduleModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900">
                    Schedule Email
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-4">
                    Fill in the details below to schedule the email.
                  </p>

                  <form className="space-y-4">
                    <div id="component2" className="mb-5">
                      <div
                        id="toMail"
                        className="w-[531px] h-auto rounded-lg px-4 py-2 mb-1">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="emailInput">
                          To
                        </label>

                        <div className="flex flex-wrap gap-2 mb-2 w-">
                          {emails.map((email, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                              <span>{email}</span>
                              <button
                                type="button"
                                className="ml-2 text-red-500 focus:outline-none"
                                onClick={() => removeEmail(index)}>
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                        <input
                          type="email"
                          id="emailInput"
                          value={emailInput}
                          onChange={handleEmailChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Enter email and press Enter"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[40px]"
                        />
                      </div>

                      <div id="ccMail" className="px-4 py-2 w-[531px] h-auto rounded-lg">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="ccEmailInput">
                          CC
                        </label>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {ccEmails.map((email, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                              <span>{email}</span>
                              <button
                                type="button"
                                className="ml-2 text-red-500 focus:outline-none"
                                onClick={() => removeCcEmail(index)}>
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>

                        <input
                          type="email"
                          id="ccEmailInput"
                          value={ccEmailInput}
                          onChange={handleCcEmailChange}
                          onKeyDown={handleCcKeyDown}
                          placeholder="Enter email and press Enter"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[40px]"
                        />
                      </div>

                      <p className="font-semibold text-[14px] leading-[22.4px] text-left text-[#333333BF] mt-3 pb-3">
                        Fields Exported
                      </p>

                      <div className="grid gap-4 grid-cols-2">
                        {fields.map(({ label, key }) => (
                          <div key={key} className="flex items-center">
                            <input

                              type="checkbox"
                              className="peer mr-2 accent-[#228276]"
                              checked={selectedFields.includes(key)}
                              onChange={() => handleCheckboxChange(key)}
                            />
                            <label

                              className="text-gray-400 peer-checked:text-black font-normal text-[14px] leading-[22.4px] text-left"
                              style={{ fontFamily: "SF Pro Text" }}
                            >
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div id="component3" className="mb-5">
                      <div className="grid gap-4 grid-cols-2">
                        <div id="datePicker1" className="">
                          <div className="font-semibold text-[14px] leading-[22.4px] text-left text-[#474747] mb-2">
                            Repeat Every
                          </div>
                          <input
                            id="weekNumberInput"
                            type="number"
                            min="1"
                            max="30"
                            className="w-16 h-[40px] p-2 border border-gray-300 rounded-lg font-semibold text-[14px] leading-[22.4px] text-left mr-2"
                          />
                          <select
                            className="p-2 h-[40px] w-40 border border-gray-300 rounded-lg font-semibold text-[14px] leading-[22.4px] bg-white"
                            value={selectedInterval}
                            onChange={e => setSelectedInterval(e.target.value)}>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                          </select>
                        </div>

                        {/* Conditional rendering based on selectedInterval */}
                        {selectedInterval === "week" && (
                          <div id="datepicker2">
                            <div className="font-semibold text-[14px] leading-[22.4px] text-left text-[#474747] mb-3">
                              Repeat On
                            </div>
                            <div className="flex space-x-2">
                              {days.map((day, index) => (
                                <button
                                  type="button"
                                  key={index}
                                  onClick={() => toggleDay(index)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedDay === index
                                    ? "bg-[#228276] text-white"
                                    : "bg-white border text-black"
                                    }`}>
                                  {day}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedInterval === "month" && (
                          <div id="datepicker2">
                            <div className="font-semibold text-[14px] leading-[22.4px] text-left text-[#474747] mb-2">
                              Repeat On
                            </div>
                            <input
                              type="date"
                              name=""
                              id=""
                              selected={selectedDate}
                              onChange={date => setSelectedDate(date)}
                              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}

                        {selectedInterval === "year" && (
                          <div id="datepicker2">
                            <div className="font-semibold text-[14px] leading-[22.4px] text-left text-[#474747] mb-2">
                              Repeat On
                            </div>
                            <input
                              type="date"
                              name=""
                              id=""
                              selected={selectedDate}
                              onChange={date => setSelectedDate(date)}
                              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />{" "}
                          </div>
                        )}
                      </div>
                    </div>
                    <div id="component4" className="mb-2">
                      <p className="font-semibold text-[14px] leading-[22.4px] text-left text-[#474747]">
                        End On
                      </p>

                      <div className="grid grid-cols-3 gap-4 pb-2">
                        <div className="p-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="never"
                              name="endOption"
                              value="never"
                              checked={selectedOption === "never"}
                              onChange={e => setSelectedOption(e.target.value)}
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor="never"
                              className="font-semibold text-[14px] leading-[22.4px] text-gray-700">
                              Never
                            </label>
                          </div>
                        </div>

                        <div className="p-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="on"
                              name="endOption"
                              value="on"
                              checked={selectedOption === "on"}
                              onChange={e => setSelectedOption(e.target.value)}
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor="on"
                              className="font-semibold text-[14px] leading-[22.4px] text-gray-700">
                              On
                            </label>
                          </div>

                          <div className="mt-2">
                            <input
                              type="date"
                              selected={selectedEndDate}
                              onChange={date => setSelectedEndDate(date)} // Pass a Date object here
                              className={`border border-gray-300 mt-2 rounded-lg p-1 w-full ${selectedOption !== "on"
                                ? "bg-gray-300 cursor-not-allowed"
                                : ""
                                }`}
                              disabled={selectedOption !== "on"} // Disable based on the selectedOption
                            />
                          </div>
                        </div>

                        <div className="p-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="after"
                              name="endOption"
                              value="after"
                              checked={selectedOption === "after"}
                              onChange={e => setSelectedOption(e.target.value)}
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor="after"
                              className="font-semibold text-[14px] leading-[22.4px] text-gray-700">
                              After
                            </label>
                          </div>

                          <div className="mt-2 flex items-center space-x-2">
                            <input
                              type="number"
                              value={occurrences}
                              onChange={e => setOccurrences(e.target.value)}
                              className={`border mt-2 border-gray-300 rounded-lg p-1 w-16 ${selectedOption !== "after"
                                ? "bg-gray-300 cursor-not-allowed"
                                : ""
                                }`}
                              min="1"
                              disabled={selectedOption !== "after"}
                            />
                            <span className="text-gray-700">Occurrences</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="component5" className="mb-6">
                      <p className="font-semibold text-[14px] leading-[22.4px] text-left text-[#474747] p-2">
                        Format
                      </p>
                      <select className="p-2 h-[40px] w-40 border border-gray-300 text-gray-500 rounded-lg font-semibold text-[14px] leading-[22.4px] bg-white">
                        <option>Excel</option>
                        <option>Word</option>
                        <option>PDF</option>
                      </select>
                    </div>
                  </form>

                  {/* Buttons */}
                  <div className="mt-4 flex justify-start space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                      onClick={() => {
                        closeScheduleModal();
                      }}>
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSchedule}
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-md">
                      Save Schedule
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isConfirmationModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeConfirmationModal}>
          {/* <button onClick={closeConfirmationModal} className="absolute top-4 right-4">
          <img src={crossIcon} alt="Close" className="w-3 h-3" />
        </button> */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full  items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="w-full px-3 pt-3 pb-3 border">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900">
                      Are you sure you want to schedule the export?
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                      Click on “Schedule Export” to confirm your action
                    </p>
                  </div>

                  <div className="mt-2 px-3 mb-3 ml-2">
                    <p className="text-sm">
                      Repeats every 1 Week on Monday and ends on Never
                    </p>
                  </div>

                  <div className="flex justify-start ml-1 space-x-2 pb-3 pl-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-white border-2 border-green-600 text-green-600 rounded-lg"
                      onClick={closeConfirmationModal}>
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                      onClick={submitConfirmationModal}>
                      Schedule Email
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isScheduledModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeScheduledModal}>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full  items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="w-full px-3 pt-3 pb-3 border">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900">
                      Report was Scheduled Successfully!
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                      You may modify the recurrence settings at any time
                    </p>
                  </div>


                  <div className="flex justify-start mt-3 ml-1 space-x-2 pb-3 pl-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-white border-2 border-green-600 text-green-600 rounded-lg"
                      onClick={closeScheduledModal}>
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
