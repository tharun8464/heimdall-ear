import Loader from "../Loader/Loader";
import styles from "./Button.module.css";

const Button = ({
  svg,
  text,
  icon,
  src,
  isActive,
  onClick,
  className,
  isReverse,
  isDisabled,
  disabledClassName,
  buttonTextClassName,
  defaultIcon,
  imgClassName,
  isLoading,
  btnType,
  isDeleteButton,
  parentButtonStyle,
}) => {
  return (
    <button
      className={` ${styles.Button} ${className} ${btnType === "primary" ? styles.PrimaryBtn : ""
        } ${isDisabled && disabledClassName ? ` ${disabledClassName}` : ""} ${isDisabled && !disabledClassName ? styles.DefaultDisabledClass : ""
        } ${btnType === "secondary" ? styles.SecondaryBtn : ""} ${btnType === "transparent" ? styles.TransparentBtn : ""}`}
      onClick={onClick}
      style={
        isActive
          ? {
            borderColor: "var(--primary-orange)",
            color: "var(--primary-orange)",
          }
          : parentButtonStyle
            ? parentButtonStyle
            : {}
      }
      disabled={isDisabled}
    >
      {isReverse ? null : text ? (
        <p className={`${styles.ButtonText} ${buttonTextClassName ? buttonTextClassName : ""}`}>
          {text}
        </p>
      ) : null}
      {src ? (
        <img
          src={src}
          alt="icon"
          className={`${styles.ButtonIcon} ${imgClassName}`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = defaultIcon;
          }}
        />
      ) : (
        icon
      )}
      {isReverse ? (
        text ? (
          <p className={`${styles.ButtonText} ${buttonTextClassName}`}>{text}</p>
        ) : null
      ) : null}
      {isLoading ? <Loader isDeleteButton={isDeleteButton} /> : ""}
    </button>
  );
};

export default Button;
