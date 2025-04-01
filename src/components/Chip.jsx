const Chip = ({ chipValue, groupName, onClick, idValue }) => {
  return (
    <>
      <input
        type="radio"
        className="chip__value"
        id={idValue} // id와 label의 htmlFor을 맞춰야 선택되기 위해 사용
        value={chipValue}
        name={groupName} // 그룹화를 위해 name 태그 사용
        onClick={onClick}
      />
      <label htmlFor={idValue} className="chip__label">
        {chipValue}
      </label>
    </>
  );
};

export default Chip;
