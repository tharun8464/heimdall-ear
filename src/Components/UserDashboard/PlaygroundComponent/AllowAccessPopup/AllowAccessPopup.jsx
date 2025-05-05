import React, { useState, useEffect } from 'react';
import styles from './AllowAccessPopup.module.css';
import AllowAccessImage from "../../../../assets/images/Playground/AllowAccessImage.svg"
import Button from '../../../Button/Button';
import ShowInstructionsPopup from '../ShowInstructionsPopup/ShowInstructionsPopup';

const AllowAccessPopup = ({ hasPermissionDeniedOnce, checkPermissions, onGrantAccess, canAskPermission }) => {


    useEffect(() => {
        checkPermissions();
    }, []);

    if (!canAskPermission) {
        return <ShowInstructionsPopup />
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            {canAskPermission ? (
                <div className={`${styles.Wrapper} w-[715px] flex flex-col gap-6 bg-white p-4 rounded-lg z-30 justify-center items-center`}>
                    <img src={AllowAccessImage} className='w-[379px] h-[261px]' alt="Allow Access" />
                    <div className='flex flex-col gap-2 justify-center items-center'>
                        <h1 className='text-[24px] font-bold'>Allow Access</h1>
                        <span className='text-[16px]'>You will need to turn on your microphone and camera to move ahead with the test</span>
                    </div>
                    {hasPermissionDeniedOnce && (
                        <Button
                            className=''
                            btnType="primary"
                            text="Grant Access"
                            onClick={() => {
                                onGrantAccess();
                                checkPermissions();
                            }}
                        />
                    )}
                </div>
            ) : (
                <ShowInstructionsPopup />
            )}
        </div>
    );
};

export default AllowAccessPopup;
