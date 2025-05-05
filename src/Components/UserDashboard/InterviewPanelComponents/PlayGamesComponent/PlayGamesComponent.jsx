import { Close } from "@material-ui/icons";
import styles from "../../../../assets/stylesheet/playGamesComponent.module.css";

const PlayGamesComponent = () => {
  return (
    <div className={styles.Wrapper}>
      <Close className={styles.CloseIcon} />
      <h2 className={styles.Heading}>
        Play interactive games before your interview starts!
      </h2>{" "}
      <button className={styles.PlayBtn}>Play</button>
    </div>
  );
};

export default PlayGamesComponent;
