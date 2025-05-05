import { useParams } from "react-router-dom";
import styles from "./ViewDropMenu.module.css";
import { useSelector } from "react-redux";

function ViewDropMenu({ viewMenuPosition }) {
  const { weightageData } = useSelector((state) => state.weightage);

  return (
    <>
      <div className={styles.menuContainer} style={{ top: 430, left: 902 }}>
        <div className={styles.menu}>
          <ul>
            {weightageData &&
              weightageData.map((data, index) => (
                <li className={styles.dropdownItem}>{`${data.name}`}</li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
export default ViewDropMenu;
