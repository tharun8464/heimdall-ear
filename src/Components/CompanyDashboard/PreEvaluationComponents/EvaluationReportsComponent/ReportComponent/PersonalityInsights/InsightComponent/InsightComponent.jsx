import ProgressBar from "@ramonak/react-progress-bar";
import CustomChip from "../../../../../../CustomChip/CustomChip";
import styles from "./InsightComponent.module.css";

const InsightComponent = ({ text, chips, percentage, chipsRef }) => {

  return (
    <div className={styles.Wrapper}>
      <span>{text}</span>

      <div className={styles.ProgressWrapper}>
        <div className={styles.ChipsWrapper}>
          {chips.map((lable) => (
            lable === "Data not sufficient" ? (
              <p className={styles.NodataText} >{lable}</p>
            ) : (
              <div className={styles.ChipsClass} key={lable}><span>{lable}</span></div>
              // <CustomChip label={lable} customClass={styles.ChipsClass} ref={chipsRef} />
            )

          ))}
        </div>
        {chips?.includes("Data not sufficient") ? null : (
          <div className={styles.PercentageWrapper}>
            <span>{percentage}%</span>
            <ProgressBar
              barContainerClassName={styles.BarContainerClassName}
              customLabel={null}
              completed={percentage}
              className={styles.ProgressBar}
              bgColor="var(--primary-green)"
              baseBgColor={"var(--border-grey)"}
              borderRadius="14px"
              height=".6rem"
              isLabelVisible={false}
            />
          </div>
        )}
      </div>
      <hr className={styles.Divider} />
    </div>
  );
};

export default InsightComponent;
