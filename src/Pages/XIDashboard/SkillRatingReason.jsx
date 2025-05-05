import { useEffect, useState, useRef } from "react";
import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";

const SkillRatingReason = (props) => {
  const [reason, setReason] = useState('');

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleCancelClick = () => {
    props.reasonCancel();
  };

  const handleSubmitClick = () => {
    props.reasonSubmit(props.currentRole,props.currentSkill,props.currentRat,reason);
  };

  // Conditionally disable the Submit button based on character count
  const isSubmitDisabled = reason.length < 50;

  return (
    <>
      <Transition
        appear
        show={props.showReason}
        as={Fragment}
        className="relative z-10 w-full "
        style={{ zIndex: 1000 }}
      >
        <Dialog as="div" className="relative z-10 w-4/5" onClose={() => {}} static={true}>
          <div
            className="fixed inset-0 bg-black/30"
            aria-hidden="true"
          />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center text-center max-w-4xl mx-auto">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle transition-all min-h-[30vh]">
                  <div className="rounded-lg bg-white w-full">
                    <div className="flex items-start space-x-3">
                      <div
                        className="py-4 w-full flex"
                        style={{ backgroundColor: "#228276" }}
                      >
                        <p className="text-lg mx-5 text-center text-white font-semibold">
                          Reason
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mx-16 my-4">
                      <div className="w-auto">
                        <p>Please provide a reason for your decision</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mx-16 my-4">
                      <div className="w-auto">
                        <textarea
                          rows="4"
                          cols="50"
                          value={reason}
                          onChange={handleReasonChange}
                          placeholder="Enter at least 50 characters..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mx-16 my-4">
                      <div className="w-auto">
                        <p>Characters: {reason.length}</p>
                      </div>
                    </div>

                    <div className="w-auto mx-auto flex justify-center my-3">
                      <button
                        onClick={handleCancelClick}
                        className="text-white px-4 py-2 rounded"
                        style={{ backgroundColor: "grey", marginRight: "10px" }}
                      >
                        Cancel
                      </button>
                      {!isSubmitDisabled?
                      <button
                        onClick={handleSubmitClick}
                        className="text-white px-4 py-2 rounded"
                        style={{ backgroundColor: "#228276" }}>
                        Submit
                      </button>
                      :null}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SkillRatingReason;
