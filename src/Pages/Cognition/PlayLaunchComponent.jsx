import { useEffect, useState, useRef } from "react";
import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";

const PlayLaunchComponent = (props) => {

  useEffect(() => {
    const initial = async () => {
    };
    initial();
  }, []);

    return (
        <>
        <Transition appear show={true} as={Fragment} className="relative z-10 w-full " style={{ zIndex: 1000 }}>
            <Dialog as="div" className="relative z-10 w-5/6 " onClose={() => { }} static={true}>
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
                            <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all min-h-[75vh]">
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
        </>
    );

}

export default PlayLaunchComponent;