import CustomChip from "../../../../CustomChip/CustomChip";
import styles from "./SkillDetailComponent.module.css";
import StarIcon from "@mui/icons-material/Star";

const SkillDetailComponent = ({ heading, stars, chips }) => {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.HeadingWrapper}>
        <span className={styles.Skill}>{heading}</span>
        <div>
          {new Array(Math.round(stars))?.fill(1)?.map((_, index) => (
            <StarIcon
              key={index}
              sx={{
                color: `${"var(--primary-green)"}`,
                fontSize: "20px !important",
              }}
            />
          ))}
          {Math.round(stars) < 5
            ? new Array(Math.round(5 - stars))?.fill(1)?.map((_, index) => (
                <StarIcon
                  key={index}
                  sx={{
                    color: `${"var(--border-grey)"}`,
                    fontSize: "20px !important",
                  }}
                />
              ))
            : null}
        </div>
      </div>
      <div className={styles.ChipsWrapper}>
        {chips?.map((chip, index) => {
          return <CustomChip label={chip} key={index} type="success" />;
        })}
      </div>
    </div>
  );
};

export default SkillDetailComponent;
