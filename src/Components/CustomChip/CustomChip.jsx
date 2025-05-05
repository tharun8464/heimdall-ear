import { Chip } from "@mui/material";
import styles from "./CustomChip.module.css";

const CustomChip = ({
  label,
  type = "default",
  customClass,
  onClick,
  onDelete,
  deleteIcon,
  dataToolTipId,
}) => {
  return (
    <Chip
      id="customChip"
      onClick={onClick}
      label={label}
      deleteIcon={deleteIcon}
      onDelete={onDelete}
      data-tooltip-id={dataToolTipId}
      className={` ${styles.Chip} ${type === "success" ? styles.Success : ""} ${styles.customClass
        } ${type === "warning" ? styles.Warning : ""} ${type === "error" ? styles.Error : ""
        } ${customClass ?? ""} ${type === "solid-error" ? styles.SolidError : ""
        } ${type === "solid-success" ? styles.SolidSuccess : ""} ${type === "solid-warning" ? styles.SolidWarning : ""
        }  ${type === "high-talent" ? styles.TalentHigh : ""
        }  ${type === "high-plus" ? styles.TalentHighplus : ""
        } ${type === "low-talent" ? styles.TalentLow : ""
        }  ${type === "medium-talent" ? styles.TalentMedium : ""
        }
      }  ${type === "top-talent-five" ? styles.TalentTopFive : ""
        }
      ${type === "top-talent" ? styles.TalentTop : ""
        } ${type === "regular" ? styles.Regular : ''}`}
    />
  );
};

export default CustomChip;
