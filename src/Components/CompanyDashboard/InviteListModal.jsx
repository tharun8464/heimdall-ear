// InviteListModal.js
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import ResendConfirmationModal from './ResendConfirmationModal';

export default function InviteListModal({ isOpen, closeModal }) {
    const [isResendModalOpen, setIsResendModalOpen] = useState(false);

    const invites = [
        { jobId: '1234567890', role: 'SDE', candidateName: 'John Doe', expiry: '01/08/2024' },
        // Repeat as needed
    ];

    const openResendModal = () => setIsResendModalOpen(true);
    const closeResendModal = () => setIsResendModalOpen(false);

    return (
        <>
            {isOpen && (
                <Dialog open={isOpen} onClose={closeModal} className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                            <Dialog.Title className="text-lg font-medium text-gray-900">Resend Invites</Dialog.Title>
                            <div className="mt-4">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">Job Id</th>
                                            <th className="px-4 py-2">Job Role</th>
                                            <th className="px-4 py-2">Candidate Name</th>
                                            <th className="px-4 py-2">Link Expires On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invites.map((invite, index) => (
                                            <tr key={index}>
                                                <td className="border px-4 py-2">{invite.jobId}</td>
                                                <td className="border px-4 py-2">{invite.role}</td>
                                                <td className="border px-4 py-2">{invite.candidateName}</td>
                                                <td className="border px-4 py-2">{invite.expiry}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                                    onClick={openResendModal}
                                >
                                    Resend Invite
                                </button>
                            </div>
                            <button className="absolute top-2 right-2" onClick={closeModal}>
                                &#x2715;
                            </button>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
            <ResendConfirmationModal isOpen={isResendModalOpen} closeModal={closeResendModal} />
        </>
    );
}
