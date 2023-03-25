import React from "react";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import OutsideAlerter from "../../../hooks/useClickOutside";
import AddLineIcon from "remixicon-react/AddLineIcon";
import { useDispatch } from "react-redux";
import { setOpenModal } from "../../../redux/slices/mainState";
const CustomSelect = ({
  options = [],
  label = "",
  placeholder = "",
  value,
  onChange,
  name,
  required,
  type = "",
}) => {
  const { t: tl } = useTranslation();
  let selected = options?.find((item) => item.id == value);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  return (
    <div
      className={`form-item interface form-item-dropdown ${
        visible && "active"
      }`}
      onClick={() => setVisible(!visible)}
    >
      <div className="label">{tl(label)}</div>
      <div className="plch">{selected ? selected.value : tl(placeholder)}</div>
      <ArrowDownSLineIcon className="suffix" size={20} />
      <OutsideAlerter visible={visible} setVisible={setVisible}>
        <div className="option">
          {options?.length === 0 && type === "address" && (
            <div
              className="add-address-btn"
              onClick={() => dispatch(setOpenModal(true))}
            >
              <AddLineIcon />
              <span>{tl("Add new address")}</span>
            </div>
          )}
          {options?.map((item, key) => (
            <div
              key={key}
              className="option-item"
              onClick={() => onChange(item)}
            >
              <div className="status">
                <input
                  onChange={() => {}}
                  required={required}
                  type="radio"
                  id="option"
                  name={name}
                  value={selected?.value}
                  checked={selected?.value === item.value}
                />
              </div>
              <label htmlFor="#option" className="label">
                {tl(item.value)}
              </label>
            </div>
          ))}
        </div>
      </OutsideAlerter>
    </div>
  );
};

export default CustomSelect;
