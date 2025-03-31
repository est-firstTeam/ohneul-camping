import { useState } from "react";
import Button from "./Button";
import icoarrowdown from "../images/ico-arrowdown.svg";
import useSearchStore from "../store/useSearchStore";

const SelectBox = ({ valueArr }) => {
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
            {valueArr?.map((arr, index) => (
              <li
                key={index}
                className="option-item"
                value={arr}
                onClick={handleChangeOption}
              >
                {arr}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SelectBox;
