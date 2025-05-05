import React, { useEffect, useState } from 'react';
import ProctoringTerms from './ProctoringTerms.jsx';
import { useDyteClient, DyteProvider } from '@dytesdk/react-web-core';
import { proctoringUtil } from '../../service/invitationService.js';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import ProctoringCheck from './ProctoringCheck.jsx';
import { getSessionStorage } from '../../service/storageService.js';
const ProctoringUtil = props => {
  const [showProctoringTerms, setShowProctoringTerms] = useState(true);
  const [user, setUser] = useState(JSON.parse(getSessionStorage("user")));
  const [meeting, initMeeting] = useDyteClient();
  const [initDyte, setInitDyte] = useState(false);
  const navigate = useNavigate();

  const handleContinueClick = () => {
    // Handle the "Continue" action here.
    // This function will be called when the "Continue" button is clicked.
    setShowProctoringTerms(false);
    //initiate the meeting
    proctoringUtil(user._id, props.action).then(resp => {
      if (resp && resp?.data?.participantToken) {
        initMeeting({
          authToken: resp?.data?.participantToken,
          defaults: {
            audio: true,
            video: true,
          },
        }).then(() => {
          // enable start webcam, start audio and screen share
          //console.log('init done');
          setInitDyte(true);
        });
      } else {
        swal({
          icon: 'error',
          title: 'Proctoring',
          text: 'Something went wrong',
          button: 'OK',
        });
      }
    });
  };

  const handleBackClick = () => {
    // Handle the "Back" action here.
    // This function will be called when the "Back" button is clicked.
    setShowProctoringTerms(false); // Close the child page/modal.
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [initDyte]);

  return (
    <div>
      {showProctoringTerms && (
        <ProctoringTerms
          onContinueClick={handleContinueClick}
          onBackClick={handleBackClick}
        />
      )}
      {initDyte && (
        <DyteProvider value={meeting}>
          <ProctoringCheck renderComponent={props.renderComponent} />
        </DyteProvider>
      )}
    </div>
  );
};

export default ProctoringUtil;
