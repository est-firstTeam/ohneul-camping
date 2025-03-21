import React from "react";
import ItemDetails from "./ItemDetails";
import Checkbox from "./Checkbox";
import Button from "./Button";
import { commaNumber } from "../util/util";

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
}) => {
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
          <br />소 {selected1}자리, 중 {selected2}자리, 대 {selected3}자리,
          카라반 {selected4}자리
        </ItemDetails>
        <ItemDetails type="price" size="reserved">
          {commaNumber(sumPrice)}
        </ItemDetails>
        <ItemDetails type="unit" size="reserved">
          원 {!isCart && "~"}
        </ItemDetails>
      </div>
      {/* 예약 확인에서 true */}
      {isRSV && (
        <Button color={"primary"} size={"midium"} margin={"1rem"}>
          예약 취소
        </Button>
      )}
    </div>
  );
};

export default ProductListCart;
