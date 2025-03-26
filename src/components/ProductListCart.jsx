import React from "react";
import ItemDetails from "./ItemDetails";
import Checkbox from "./Checkbox";
import Button from "./Button";
import { commaNumber } from "../util/util";
import closeIcon from "/src/images/ico_close.svg";
//TODO
// - data 연결

// 마이페이지 상품 리스트
const ProductListCart = ({
  id,
  firstImageUrl,
  facltNm, //item
  startDate,
  endDate,
  day,
  selected1, // 선택 옵션
  selected2,
  selected3,
  selected4,
  sumPrice, // 옵션 합산 가격
  isRSV, // 장바구니 (true)
  isCart, // 예약 확인 (true)
  checked,
  handleCheckboxChange,
  handleDeleteItem,
  isDisabled, // 버튼 비활성화 상태
  buttonText,
  onCancelClick,
}) => {
  // 0은 보이지 않게 함
  const availableSites = [
    selected1 !== 0 && `소 ${selected1}자리`,
    selected2 !== 0 && `중 ${selected2}자리`,
    selected3 !== 0 && `대 ${selected3}자리`,
    selected4 !== 0 && `카라반 ${selected4}자리`,
  ];
  const sitesSort = availableSites.filter(Boolean).join(", ");

  return (
    <div className="product product--w26">
      <img src={firstImageUrl} className="product__image" />
      <div className="detail-list">
        {/* 장바구니에서 true */}
        {isCart ? (
          <Checkbox
            key={facltNm}
            checked={checked}
            onChange={() => handleCheckboxChange(id)}
            label={
              <ItemDetails type="title" size="chked">
                {facltNm}
              </ItemDetails>
            }
          />
        ) : (
          <ItemDetails type="title" size="small">
            {facltNm}
          </ItemDetails>
        )}
        <ItemDetails type="text" color="gray">
          {startDate} ~ {endDate} ({day}박)
          <br />
          {sitesSort}
        </ItemDetails>
        <ItemDetails type="price" size="reserved">
          {commaNumber(sumPrice)}
        </ItemDetails>
        <ItemDetails type="unit" size="reserved">
          원 {!isCart}
        </ItemDetails>
      </div>
      {/* 예약 확인에서 true */}
      {isRSV && (
        <Button
          color={"primary"}
          size={"midium"}
          margin={"1rem"}
          disabled={isDisabled}
          onClick={onCancelClick}
        >
          {buttonText}
        </Button>
      )}
      {/* 장바구니에서만 제거 버튼 표시 */}
      {handleDeleteItem && (
        <button className="btn-close" onClick={handleDeleteItem}>
          <img src={closeIcon} width={"8px"} height={"8px"} />
        </button>
      )}
    </div>
  );
};

export default ProductListCart;
