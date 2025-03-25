import { useState } from "react";
import Button from "./Button";
import icoarrowdown from "../images/ico-arrowdown.svg";

const SelectBox = () => {
  const [showOption, setShowOption] = useState(false);
  const [value, setValue] = useState("추천순");

  const handleChangeOption = (e) => {
    const { innerText } = e.target;
    setValue(innerText);
    setShowOption((prev) => !prev);
  };

  return (
    <>
      <div className="select-box">
        <Button
          className={"btn-selectbox"}
          color={"secondary"}
          onClick={() => setShowOption((prev) => !prev)}
          icon={<img src={icoarrowdown} />}
          iconPosition="right"
        >
          {value}
        </Button>
        {showOption && (
          <ul className="option-list">
            <li
              className="option-item"
              value="추천순"
              onClick={handleChangeOption}
            >
              추천순
            </li>
            <li
              className="option-item"
              value="최신 등록순"
              onClick={handleChangeOption}
            >
              최신 등록순
            </li>
            <li
              className="option-item"
              value="낮은 가격순"
              onClick={handleChangeOption}
            >
              낮은 가격순
            </li>
            <li
              className="option-item"
              value="높은 가격순"
              onClick={handleChangeOption}
            >
              높은 가격순
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default SelectBox;
