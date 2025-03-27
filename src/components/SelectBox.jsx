import { useState } from "react";
import Button from "./Button";
import icoarrowdown from "../images/ico-arrowdown.svg";
import useSearchStore from "../store/useSearchStore";

const SelectBox = () => {
  const [showOption, setShowOption] = useState(false);
  const { filterValue, setFilterValue } = useSearchStore();

  const handleChangeOption = (e) => {
    const { innerText } = e.target;
    setFilterValue(innerText);
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
          {filterValue}
        </Button>
        {showOption && (
          <ul className="option-list">
            <li
              className="option-item"
              value="재고 많은 순"
              onClick={handleChangeOption}
            >
              재고 많은 순
            </li>
            <li
              className="option-item"
              value="야영장 가나다 순"
              onClick={handleChangeOption}
            >
              야영장 가나다 순
            </li>
            <li
              className="option-item"
              value="지역 가나다 순"
              onClick={handleChangeOption}
            >
              지역 가나다 순
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default SelectBox;
