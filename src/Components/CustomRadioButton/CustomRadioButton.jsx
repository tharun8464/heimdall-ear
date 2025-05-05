import styles from "./CustomRadioButton.module.css";

const CustomRadioButton = ({ name, value, customClass, id, onChange }) => {
  return (
    <input
      type="radio"
      name={name}
      value={value}
      className={styles.RadioButton}
      id={id}
      onChange={onChange}
    />
  );
};

export default CustomRadioButton;
