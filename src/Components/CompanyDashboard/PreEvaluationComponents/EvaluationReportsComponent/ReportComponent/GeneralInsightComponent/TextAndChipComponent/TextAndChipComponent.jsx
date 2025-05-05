import CustomChip from "../../../../../../CustomChip/CustomChip";
import styles from "./TextAndChipComponent.module.css";
import CircleIcon from "@mui/icons-material/Circle";

const TextAndChipComponent = ({ title, chipText, chipType = "success" }) => {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.BulletWrapper}>
        {/* <CircleIcon fontSize="small" sx={{ fontSize: ".3rem" }} /> */}
        <div class="h-2 w-2 bg-black rounded-full mt-1"></div>
        <span className="text-xs">{title}</span>
      </div>
      {/* <CustomChip label={chipText} customClass={styles.ChipClass} type={chipType} /> */}
    </div>
  );
};

export default TextAndChipComponent;
