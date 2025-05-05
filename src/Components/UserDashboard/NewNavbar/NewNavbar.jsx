import logo_new from "../../../assets/images/logo_new.png";
import styles from "../../../assets/stylesheet/NewNavbar.module.css";

const NewNavbar = () => {
  return (
    <div className={styles.Navbar}>
      <div className={styles.LogoWrapper}>
        <img src={logo_new} alt="valuematrix" className={styles.Logo} />
        <h1 className={styles.Heading}>ValueMatrix</h1>
      </div>
      <div className={styles.NavLinks}>
        <span className={styles.TroubleText}>Having Trouble?</span>
        <a href="#">
          <button className={styles.ContactBtn}>Contact Us</button>
        </a>
      </div>
    </div>
  );
};

export default NewNavbar;
