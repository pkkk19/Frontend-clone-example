import React from "react";
import { Input } from "reactstrap";

const InputDate = ({
  label,
  placeholder,
  name,
  required,
  invalid = false,
  valid = false,
  value,
  onChange = () => {},
}) => {
  return (
    <div className="form-item">
      <div className="label">{label}</div>
      <Input
        type="date"
        name={name}
        placeholder={placeholder}
        valid={valid}
        invalid={invalid}
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        required={required}
      />
    </div>
  );
};

export default InputDate;
