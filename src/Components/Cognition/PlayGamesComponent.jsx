import { Close } from "@material-ui/icons";
import styles from "../../assets/stylesheet/cognition/congnitionComponent.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PlayGames from "../../Pages/PlayGames";
import { getTraitsForPlay } from "../../service/invitationService";
import swal from "sweetalert";
import { ThreeDots } from "react-loader-spinner";
import ProctoringUtil from "../../Pages/Proctoring/ProctoringUtil";

const PlayGamesComponent = (props) => {
  const [startGame, setStartGame] = useState(false);
  const [loader, setLoader] = useState(false);
  const [traitsObj, setTraitsObj] = useState(null);

  useEffect(() => { }, [startGame]);

  const handlePopup = async () => {
    setLoader(true);
    // check if the user has been invited to a job
    let traitsResp = await getTraitsForPlay(props.userId);
    if (traitsResp.status === 204) {
      swal({
        title: "Interactive games",
        text: "At the moment, there are no pending games.",
        icon: "info",
        button: "Ok",
      }).then(() => {
        setLoader(false);
      });
    } else {
      // extract the games id from the response
      if (traitsResp?.data?.traits) {
        let allMasterChallenges = [];
        traitsResp?.data?.traits.forEach((item) => {
          // Concatenate the masterchallenges arrays to the new array
          allMasterChallenges.push(...item.masterchallenges);
        });
        setTraitsObj(allMasterChallenges);
        // setTraitsObj(traitsResp?.data?.traits[0]);
        setLoader(false);
        setStartGame(true);
      }
    }
  };
  return (
    <>
      <div className={`${styles.Wrapper} ${props.customClass ?? ""}`}>
        <Close className={styles.CloseIcon} />
        <h2 className={styles.Heading}>Play interactive games !</h2>{" "}
        {loader ? (
          <ThreeDots
            height="50"
            width="50"
            radius="12"
            color="#F5F1FF"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        ) : (
          <button className={styles.PlayBtn} onClick={handlePopup}>
            Play
          </button>
        )}
      </div>
      {startGame ? (
        <ProctoringUtil
          action={"cognition"}
          renderComponent={(
            handleStop,
            videoEnabled,
            audioEnabled,
            screenShareEnabled,
            verifyShares
          ) => (
            <PlayGames
              traitsObj={traitsObj}
              userId={props.userId}
              startGame={startGame}
              setStartGame={setStartGame}
              handleStop={handleStop}
              videoEnabled={videoEnabled}
              audioEnabled={audioEnabled}
              screenShareEnabled={screenShareEnabled}
              verifyShares={verifyShares}
            />
          )}
        />
      ) : null}
    </>
  );
};

export default PlayGamesComponent;
