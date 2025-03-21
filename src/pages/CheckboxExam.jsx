import React, { useState } from "react";
import Checkbox from "../components/Checkbox";

const CheckboxExam = () => {
  const items = ["인왕산캠핑장", "서울강서캠핑장", "강원파트캠핑장"];

  // 체크박스의 상태를 객체로 관리하고, 초기 상태는 모든 항목이 false인 객체로 설정
  const initialCheckedItems = {};
  items.forEach((item) => {
    initialCheckedItems[item] = false;
  });

  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);

  const allChecked = Object.values(checkedItems).every(Boolean);

  const handleCheckboxChange = (label) => {
    setCheckedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleSelectAll = () => {
    const newCheckedState = {};
    items.forEach((item) => {
      newCheckedState[item] = !allChecked;
    });
    setCheckedItems(newCheckedState);
  };

  return (
    <div>
      <h1>체크박스 예시</h1>
      <Checkbox
        checked={allChecked}
        onChange={handleSelectAll}
        label="전체 선택"
      />
      {items.map((item) => (
        <Checkbox
          key={item}
          checked={checkedItems[item] || false}
          onChange={() => handleCheckboxChange(item)}
          label={item}
        />
      ))}
    </div>
  );
};

export default CheckboxExam;
