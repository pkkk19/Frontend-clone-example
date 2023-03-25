import React from "react";
import { useTranslation } from "react-i18next";

const InputTime = ({ label, value, name, onChange = () => {} }) => {
  const { t: tl } = useTranslation();
  return (
    <div className="form-item">
      <div className="label">{tl(label)}</div>
      <input
        onChange={(e) => onChange(e)}
        name={name}
        value={value}
        type="time"
      />
    </div>
  );
};

export default InputTime;
