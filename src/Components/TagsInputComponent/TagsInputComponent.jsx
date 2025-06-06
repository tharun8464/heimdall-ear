import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Downshift from "downshift";
import CustomChip from "../CustomChip/CustomChip";

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(0.5, 0.25),
    backgroundColor: "var(--light-green-success) !important",
    color: "var(--primary-green) !important",
  },
  inputRoot: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#e5e7eb !important",
      },
      "&:hover fieldset": {
        borderColor: "#e5e7eb !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#e5e7eb !important",
        outline: "none !important",
      },
    },
    "& .MuiInputLabel-outlined": {
      color: "gray", // Default label color
      "&.Mui-focused": {
        color: "gray !important", // Label color when input is focused
      },
    },
  },
}));

export default function TagsInput({ ...props }) {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const {
    selectedTags,
    placeholder,
    tags,
    wrapperClassName,
    selectedItem,
    setSelectedItem,
    ...other
  } = props;

  useEffect(() => {
    setSelectedItem(tags);
  }, [tags]);

  useEffect(() => {
    selectedTags(selectedItem);
  }, [selectedItem]);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      const newSelectedItem = [...selectedItem];
      const duplicatedValues = newSelectedItem.indexOf(event.target.value.trim());

      if (duplicatedValues !== -1) {
        setInputValue("");
        return;
      }
      if (!event.target.value.replace(/\s/g, "").length) return;

      newSelectedItem.push(event.target.value.trim());
      setSelectedItem(newSelectedItem);
      setInputValue("");
    }
    if (selectedItem.length && !inputValue.length && event.key === "Backspace") {
      setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
    }
  }
  function handleChange(item) {
    let newSelectedItem = [...selectedItem];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue("");
    setSelectedItem(newSelectedItem);
  }

  const handleDelete = item => () => {
    const newSelectedItem = [...selectedItem];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setSelectedItem(newSelectedItem);
  };

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }
  return (
    <React.Fragment>
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={handleChange}
        selectedItem={selectedItem}>
        {({ getInputProps }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            onKeyDown: handleKeyDown,
            placeholder,
          });
          return (
            <div className={`${wrapperClassName ?? ""}`}>
              <TextField
                className={classes.inputRoot} // Apply the custom styles
                InputLabelProps={{
                  className: classes.inputLabel, // Apply label styles
                }}
                InputProps={{
                  startAdornment: selectedItem.map(item => (
                    <Chip
                      key={item}
                      tabIndex={-1}
                      label={item}
                      className={classes.chip}
                      onDelete={handleDelete(item)}
                    />
                  )),
                  onBlur,
                  onChange: event => {
                    handleInputChange(event);
                    onChange(event);
                  },
                  onFocus,
                }}
                {...other}
                {...inputProps}
              />
            </div>
          );
        }}
      </Downshift>
    </React.Fragment>
  );
}
TagsInput.defaultProps = {
  tags: [],
};
TagsInput.propTypes = {
  selectedTags: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
};
