import styles from "./CustomInput.module.css";
const CustomInput = ({
  showLabel = false,
  label,
  placeholder,
  className,
  onChange,
  name,
  value,
  inputRef,
  required = false,
  type = "text",
  labelClassName,
  wrapperClassname,
  isErrorState = false,
  errorMessage = null,
  isDisabled = false,
  maxLength,
  onKeyPress,
  min,
  max
}) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", width: "100%" }}
      className={`${wrapperClassname ?? ""}`}>
      {showLabel ? (
        <label className={labelClassName ?? ""} htmlFor="">
          {label}
        </label>
      ) : null}
      <input
        ref={inputRef}
        type={type}
        className={` ${isDisabled ? styles.disabled : ""} ${className ?? null} ${styles.Input
          } ${isErrorState ? styles.isErrorState : ""}`}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        value={value}
        required
        disabled={isDisabled}
        maxLength={maxLength}
        onKeyPress={onKeyPress}
        min={min}
        max={max}
      />
      {errorMessage ? <span className={styles.ErrorMessage}>{errorMessage}</span> : null}
    </div>
  );
};

export const CustomSelectInput = ({
  showLabel = false,
  className,
  onChange,
  name,
  value,
  required = false,
  selectOptions,
  defaultValue,
  label,
  isErrorState = false,
  errorMessage = null,
  isDisabled = false,
  showDefaultOption = true

}) => {
  return (
    <div style={{ width: "-webkit-fill-available" }}>
      {showLabel ? <label htmlFor="">{label}</label> : null}
      <select
        className={` ${className ?? null} ${styles.Input} ${styles.dropMenuContainer} ${isErrorState ? styles.isErrorState : ""} ${isDisabled ? styles.disabled : ""}`}
        onChange={onChange}
        name={name}
        value={value}
        disabled={isDisabled}
        required>
        {showDefaultOption ? <option value="">{defaultValue ?? selectOptions?.[0]?.text}</option> : null}
        {selectOptions?.map(item => (
          <option key={item?.value} value={item?.value}>
            {item?.text}
          </option>
        ))}
      </select>
      {errorMessage ? <p className={styles.ErrorMessage}>{errorMessage}</p> : null}
    </div>
  );
};
export default CustomInput;
