import React from "react";
import checkIcon from "../images/ico-checked.svg";
import unCheckedIcon from "../images/ico-uncheked.svg";

const Checkbox = ({ checked, onClick, label }) => {
  return (
    <label className="checkbox-container">
      {/* 실제 check 여부 확인 */}
      <input type="checkbox" checked={checked} onChange={onClick} />
      {/* 커스터마이징 checkbox */}
      <span className="checkmark">
        <img src={checked ? checkIcon : unCheckedIcon} alt="체크 아이콘" />
      </span>
      {label && <span className="label">{label}</span>}
    </label>
  );
};

export default Checkbox;
