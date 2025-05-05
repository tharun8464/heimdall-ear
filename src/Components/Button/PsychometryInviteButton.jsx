import React, { useEffect, useState } from 'react'
import PsychometryInviteIcon from "../../assets/images/PreEvaluation/psychometry_invite.svg";
import PsychometryInviteSentIcon from "../../assets/images/PreEvaluation/psychometry_invite_sent.svg";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import useInvite from '../../Hooks/useInvite';
import { notify } from '../../utils/notify';
import { decreaseCredit, getCompanyCredit, getCreditMapByCompany } from '../../service/creditMapService';
import { useSelect } from 'downshift';
import { max } from 'moment';
import { useSelector } from 'react-redux';

function PsychometryInviteButton({
  firstName,
  lastName,
  email,
  contact,
  linkedinURL,
  evaluationId,
  jobId,
  candidateUserId,
  action,
  companyId,
  psychometryInvited,
  className,
  cult }) {

  const isInviteLoading = useSelector(state => state.invite.isInviteCandidateForGamifiedPsychometryLoading);
  const isError = useSelector(state => state.invite.inviteCandidateForGamifiedPsychometryError);
  const [isPsychometryInviteSent, setPsychometryInviteSent] = useState(psychometryInvited);
  const [isConfirm, setConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [requireCredits, setRequireCredits] = useState(0);
  const { handleInviteCandidateForGamifiedPsychometry, } = useInvite()

  async function handleOnClick() {
    // setPsychometryInviteSent(!isPsychometryInviteSent);
    // onPress();

    if (!isPsychometryInviteSent) {
      await checkCredits();
      setOpen(!open);
    }
  }

  function handleClosePopUp() {
    setOpen(!open);
  }

  async function handleOnConfirm() {
    if (!isConfirm) {
      //checkCredits();
      await inviteCandidate(requireCredits);
    } else {
      setConfirm(!isConfirm);
    }
  }



  async function inviteCandidate(maxCredit) {
    const data = {
      jobId,
      email,
      contact,
      evaluationId,
      firstName,
      lastName,
      linkedinURL,
      companyId,
      candidateUserId,
      maxCredit,
      inviteType: 'Psychometry'
    };
    await handleInviteCandidateForGamifiedPsychometry(data);
    //console.log("isInviteLoading: ", isInviteLoading, "isError: ", isError);
    if (!isInviteLoading && !isError) {
      //console.log("action", companyId, action, maxCredit)
      await decreaseCredit(companyId, action, maxCredit);
      notify('Psychometry Invite Sent Success');
      setPsychometryInviteSent(!isPsychometryInviteSent);
      setConfirm(!isConfirm);
      // setOpen(!open);
    } else if (!isInviteLoading && isError === 403) {
      notify('Already Invited');
      setPsychometryInviteSent(!isPsychometryInviteSent);
      setOpen(!open);
    } else {
      notify('Psychometry Invite Sent Failed', 'error');
      setOpen(!open);
    }

  }



  async function checkCredits() {
    try {
      const creditsMapResponse = await getCreditMapByCompany(companyId);
      const creditsResponse = await getCompanyCredit(companyId);

      const creditPop = creditsResponse?.data?.credit.find(
        entry => entry.action === action,
      )?.credit;
      setAvailableCredits(creditPop);
      const maxCredit = creditsMapResponse?.data?.credit.find(
        entry => entry.action === action,
      )?.credit;
      setRequireCredits(maxCredit);

      if (creditPop < maxCredit) {
        return notify('Not Enough Credits');
      }

    } catch (error) {
      ////console.error("Error verifying service:", error);
    }
  }

  return (
    <div>
      <div onClick={handleOnClick} className={`p-2 border-none ${className} ${isPsychometryInviteSent ? "hover:cursor-not-allowed" : "hover:cursor-pointer"}`}>
        {
          isPsychometryInviteSent
            ? (<span className="font-medium text-xs italic text-[#d6615a]">
              {cult ? "" : "Invited"}
            </span>)//<img src={PsychometryInviteSentIcon} alt="Psychometry Invite Sent Icon" />
            : < img src={PsychometryInviteIcon} alt="Psychometry Invite Icon" />
        }
      </div>
      <Dialog
        maxWidth='md'
        open={open}
        onClose={handleClosePopUp}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title' className={`${isConfirm ? 'invisible' : ''}`}>
          {`Invite ${firstName} ${lastName} for Gamified Psychometry`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {
              !isConfirm
                ? `Inviting the candidate for "Gamified Psychometry" require credits ${requireCredits} available credits ${availableCredits}. Do you want to proceed? `
                : `Thank you! The candidate will take approximately 10-12 minutes to complete the Gamified Psychometry. Upon completion, you'll receive a notification, post which you can pull the culture match report.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions className='p-4'>
          <button className={`px-4 py-1 border rounded-md border-[#228276] text-[#228276] ${isConfirm ? 'hidden' : ''}`} onClick={handleClosePopUp}>Cancel</button>
          <button
            className={`px-4 py-1 rounded-md text-white bg-[#228276]`}
            onClick={isConfirm ? () => setOpen(!open) : handleOnConfirm}
          >
            {isConfirm ? 'Ok' : 'Confirm Invitation'}
          </button>
        </DialogActions>
      </Dialog>
    </div>

  )
}

export default PsychometryInviteButton