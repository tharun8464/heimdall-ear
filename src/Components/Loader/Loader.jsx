import styles from "./Loader.module.css";

const Loader = ({ loader, isDeleteButton, className }) => {
  return (
    <div
      className={
        className
          ? `${className} ${styles.LoaderButton}`
          : loader === "main"
          ? styles.LoaderMain
          : isDeleteButton
          ? `${styles.LoaderButton} ${styles.LoaderRedButton}`
          : styles.LoaderButton
      }
    ></div>
  );
};

export default Loader;
