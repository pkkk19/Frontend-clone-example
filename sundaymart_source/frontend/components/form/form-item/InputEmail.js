import React from "react";
import { Input } from "reactstrap";

const InputEmail = ({
  label,
  placeholder,
  name,
  required,
  invalid = false,
  valid = false,
  value,
  disabled,
  onChange = () => {},
}) => {
  return (
    <div className="form-item">
      <div className="label">{label}</div>
      <Input
        type="email"
        name={name}
        placeholder={placeholder}
        valid={valid}
        invalid={invalid}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputEmail;
