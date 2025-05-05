import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineClose, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import Button from "../../Components/Button/Button";
import styles from "./AccordianComponent.module.css";

const AccordianComponent = ({ data, conitnueFn, cancelFn, modal, setModal }) => {
  const [expandButton, setExpandButton] = useState(false);
  const [expandButtonIndex, setExpandButtonIndex] = useState(null);
  // Example data, replace with actual data source

  return (
    <div>
      {modal && (
        <Transition
          appear
          show={modal}
          as={Fragment}
          className="relative z-10 w-full "
          style={{ zIndex: 1000 }}>
          <Dialog
            as="div"
            className="relative z-10 w-5/6 "
            onClose={() => {}}
            static={true}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto ">
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-6xl m-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-[95vh]">
                    <div className={`${!modal ? "hidden" : "block"} h-full`}>
                      <div className="w-full h-full">
                        <div className="w-full h-full">
                          <div className="">
                            <div className="my-6 px-4 w-3/4 md:w-full text-left flex justify-between">
                              <div className="mt-auto mb-auto">
                                <p className="font-semibold text-[#333333]">
                                  Terms of services
                                </p>
                              </div>
                              <div className="">
                                <AiOutlineClose
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setModal(false);
                                    setExpandButton(false);
                                    setExpandButtonIndex(null);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="h-[83vh] overflow-y-scroll">
                            {data.map((details, index) => {
                              return (
                                <div
                                  key={index} // Added key for list rendering
                                  className="w-full bg-[#FFFFFF] flex flex-col justify-between"
                                  onClick={() => {
                                    setExpandButton(!expandButton);
                                    setExpandButtonIndex(index);
                                  }}>
                                  <div className="flex flex-row justify-between hover:border-b cursor-pointer px-4  py-3 hover:shadow ">
                                    <div className="mt-auto mb-auto">
                                      <p>{details.title}</p>
                                    </div>
                                    <span>
                                      {expandButton === true &&
                                      expandButtonIndex === index ? (
                                        <>
                                          <AiOutlineUp />
                                        </>
                                      ) : (
                                        <>
                                          <AiOutlineDown />
                                        </>
                                      )}
                                    </span>
                                  </div>
                                  {expandButton === true &&
                                  expandButtonIndex === index ? (
                                    <>
                                      <div className="overflow-x-auto py-3 px-4 bg-[#FAFAFA]">
                                        <p>
                                          {data[expandButtonIndex].description // Fixed typo in 'description'
                                            .split("\n")
                                            .map((item, itemIndex) => (
                                              <div key={itemIndex}>{item}</div> // Added key for list rendering
                                            ))}
                                        </p>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              );
                            })}
                            <Button
                              text={"Continue"}
                              className={styles.Continue}
                              btnType={"primary"}
                              onClick={conitnueFn}
                            />
                            <Button
                              text={"Cancel"}
                              className={styles.Cancel}
                              btnType={"secondary"}
                              onClick={cancelFn}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
};

export default AccordianComponent;
