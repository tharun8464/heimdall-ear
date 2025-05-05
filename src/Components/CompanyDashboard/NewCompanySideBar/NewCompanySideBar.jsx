import styles from "./NewCompanySideBar.module.css";
import GridViewIcon from "@mui/icons-material/GridView";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import GroupsIcon from "@mui/icons-material/Groups";

const NewCompanySideBar = () => {
  return (
    <div className={styles.Wrapper}>
      <button className={styles.PostJobBtn}>
        <AddCircleIcon sx={{ fontSize: "15px" }} />
        Post a new job
      </button>
      <div className={styles.MenuWrapper}>
        <GridViewIcon sx={{ color: "var(--icon-grey)", fontSize: "20px" }} />
        <span>Dashboard </span>
      </div>
      <div className={styles.MenuWrapper}>
        <PersonIcon sx={{ color: "var(--icon-grey)", fontSize: "20px" }} />
        <span>Profile </span>
      </div>
      <div className={styles.MenuWrapper}>
        <WorkIcon sx={{ color: "var(--icon-grey)", fontSize: "20px" }} />
        <span>Jobs </span>
      </div>
      <div className={styles.MenuWrapper}>
        <GroupsIcon sx={{ color: "var(--icon-grey)", fontSize: "20px" }} />
        <span>Company Users </span>
      </div>
    </div>
  );
};


export default NewCompanySideBar;
