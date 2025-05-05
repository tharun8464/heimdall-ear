import { Close } from "@material-ui/icons";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Checkbox, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomInput from "../../../../CustomInput/CustomInput";
import Button from "../../../../Button/Button";
import styles from "./CustomizeViewComponent.module.css";
import { useState } from "react";

// const items = [
//   { item: "Culture" },
//   { item: "Team compatibility" },
//   { item: "Cognitive" },
//   { item: "Technical" },
// ];

const CustomizeViewComponent = ({ items, checkedItems, setCheckedItems, setShowCustomizeView }) => {
  // const [checkedItems, setCheckedItems] = useState(
  //   items.reduce((acc, item) => {
  //     acc[item.item] = true;
  //     return acc;
  //   }, {})
  // );
  const handleClosePopup = () => {
    setShowCustomizeView(false);
  };
  const handleChange = (item) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [item]: !prevCheckedItems[item]
    }));
  }

  return (
    <div className={styles.Wrapper}>
      <div className={styles.HeadingWrapper}>
        <h2 className={styles.Heading}>Customize view</h2>
        <Close onClick={handleClosePopup} sx={{ cursor: "pointer" }} />
      </div>
      <div className={styles.SelectItemsWrapper}>
        <h2 className={styles.Subheading}>Select items to consider</h2>
        <ul>
          <li>
            {items.map(({ item }) => (
              <div>
                <Checkbox
                  sx={{
                    color: "grey",
                    "&.Mui-checked": {
                      color: "var(--primary-green)",
                    },
                  }}
                  checked={checkedItems[item] || false}
                  onChange={() => handleChange(item)}
                />
                <span>{item}</span>
              </div>
            ))}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomizeViewComponent;
