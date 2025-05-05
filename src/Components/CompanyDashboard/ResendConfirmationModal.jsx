// ResendConfirmationModal.js
import { Dialog } from '@headlessui/react';
import { toast } from 'react-toastify';

export default function ResendConfirmationModal({ isOpen, closeModal }) {
    const handleResendInvites = () => {
        toast.success('Invites Sent Successfully!');
        closeModal();
    };

    return (
        <>
            {isOpen && (
                <Dialog open={isOpen} onClose={closeModal} className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <Dialog.Title className="text-lg font-medium text-gray-900">
                                Are you sure you want to resend invites?
                            </Dialog.Title>
                            <div className="mt-4">
                                <p>This action will resend invitations to the selected candidates.</p>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                                    onClick={handleResendInvites}
                                >
                                    Resend Invites
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
        </>
    );
}
