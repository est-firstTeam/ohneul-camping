import React from "react";
import { useId } from "react";
import checkIcon from "../images/ico-checked.svg";
import unCheckedIcon from "../images/ico-uncheked.svg";

const Checkbox = ({ checked, onChange, label }) => {
  const id = useId();
  return (
    <div
      className="checkbox-container"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* 실제 체크 여부 확인 */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="checkbox-input"
      />

      {/* 커스텀 체크박스 */}
      <label htmlFor={id} className="checkbox-label">
        <span className="checkmark">
          <img src={checked ? checkIcon : unCheckedIcon} alt="체크 아이콘" />
        </span>
        {label && <span className="label">{label}</span>}
      </label>
    </div>
  );
};

export default Checkbox;
