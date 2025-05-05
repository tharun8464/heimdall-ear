import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
import MyMeeting from "../../../../Pages/MyMeeting";
import {
  addCandidateParticipant,
  getinterviewdetailsForBaseline,
  startMeeting,
} from "../../../../service/api";
import { useEffect, useState } from "react";
import getStorage from "../../../../service/storageService";
import { useParams } from "react-router-dom";

const MeetingComponent = ({ meeting }) => {
  return (
    <div>
      <DyteProvider value={meeting}>
        <MyMeeting />
      </DyteProvider>
    </div>
  );
};

export default MeetingComponent;
