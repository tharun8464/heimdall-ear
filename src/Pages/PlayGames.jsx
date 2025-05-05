import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import UnberryPlayer from "@tech.unberry/unberry-player";
import getStorage from "../service/storageService";
import { useSelector } from "react-redux";
import styles from "../assets/stylesheet/cognition/congnition.module.css";
import { processReport } from "../service/challengeService";
import { startProctoringForCognition } from "../service/invitationService";
import { useDispatch } from "react-redux";
import { hasPlayedAllGames } from "../Store/slices/preEvaluationSlice";
import { useDyteMeeting } from "@dytesdk/react-web-core";

const cognition_api_key = process.env.REACT_APP_COGNITION_API_KEY;

const PlayGames = ({
  traitsObj,
  userId,

  handleStop,
  videoEnabled,
  audioEnabled,
  screenShareEnabled,
  verifyShares,
}) => {
  // const [startGame, setStartGame] = useState(true);
  const [indexOfGame, setIndexOfGame] = useState(0);
  const [selectedGame, setSelectedGame] = useState({});
  const { meeting } = useDyteMeeting();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (verifyShares) {
  //     //console.log("play game verify");
  //     verifyShares();
  //   }
  // }, []);

  const handleBackOrComplete = async () => {
    //console.log("handleBackOrComplete");
    await processReport(userId);
    setIndexOfGame(prevState => {
      return prevState + 1;
    });
    setSelectedGame(null);
    meeting.self.disableScreenShare();
    meeting.self.disableVideo();
    meeting.self.disableAudio();
  };

  useEffect(() => {
    const initial = async () => {
      //await processReport(userId);
    }

    initial();
  }, [userId]);

  useEffect(() => {
    setSelectedGame(traitsObj?.[indexOfGame]);
  }, [traitsObj, indexOfGame]);

  const handleLevelUp = data => { };

  useEffect(() => {
    if (indexOfGame + 1 > traitsObj?.length) {
      dispatch(hasPlayedAllGames());
    }
  }, [indexOfGame, traitsObj]);

  return (
    <div>
      {selectedGame ? (
        <UnberryPlayer
          className={styles.UnberryPlayer}
          apiKey={cognition_api_key}
          onGameLevelEnd={data => {
            handleLevelUp(data);
          }}
          gameInfo={{
            gameId: selectedGame?.gId,
            gameUrl: selectedGame?.gUrl,
          }}
          // not to be shown on prod, for testing only
          showBack={false}
          gameListMode={false}
          onGameClose={() => {
            handleBackOrComplete();
          }}
          playerInfo={{
            id: `${userId}`,
          }}
        />
      ) : null}
    </div>
  );
};

export default PlayGames;

// const initial = async () => {
//   // let traits = [];
//   // traitsObj?.masterchallenges?.map((trait, index) => {
//   //   let traitsObj = {
//   //     gId: trait?.gId,
//   //     gUrl: trait?.gUrl,
//   //   };
//   //   traits.push(traitsObj);
//   // });
//   // setTraits(traits);
//   // Start the prometric for playing the games.
//   setSelectedGame(traits[indexOfGame]);
// };
