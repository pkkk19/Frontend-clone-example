import React from "react";
import { Input } from "reactstrap";

const InputText = ({
  label,
  placeholder,
  name,
  required,
  invalid = false,
  valid = false,
  value,
  onChange = () => {},
  onBlur = () => {},
  disabled = false,
}) => {
  return (
    <div className="form-item">
      <div className="label">{label}</div>
      <Input
        type="text"
        name={name}
        placeholder={placeholder}
        valid={valid}
        invalid={invalid}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputText;
