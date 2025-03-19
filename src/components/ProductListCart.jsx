import React, { useEffect, useState } from "react";
import ItemDetails from "./ItemDetails";
import Checkbox from "./Checkbox";
import Button from "./Button";

//TODO
// - data 연결
// - selected(선택 상품 수) 값이 없을 경우 : 보이지 않게 처리
// - startDate가 오늘 이전일 경우 (오늘 포함) : 취소 불가 버튼이 보이게

// 마이페이지 상품 리스트
const ProductListCart = ({
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
}) => {
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    setCheckedItems((prev) => ({
      ...prev,
      [facltNm]: true, // 기본 체크상태 : 예약 유도
    }));
  }, [facltNm]);

  const handleCheckboxChange = () => {
    setCheckedItems((prev) => ({
      ...prev,
      [facltNm]: !prev[facltNm],
    }));
  };

  return (
    <div className="product product--w26">
      <img src={firstImageUrl} className="product__image" />
      <div className="detail-list">
        {/* 장바구니에서 true */}
        {isCart ? (
          <Checkbox
            key={facltNm}
            checked={checkedItems[facltNm] || false}
            onClick={() => handleCheckboxChange(facltNm)}
            label={
              <ItemDetails type="title" size="chked">
                {facltNm} 예약한 야영장 이름
              </ItemDetails>
            }
          />
        ) : (
          <ItemDetails type="title" size="small">
            {facltNm} 예약한 야영장 이름
          </ItemDetails>
        )}
        <ItemDetails type="text" color="gray">
          {startDate}시작날짜 ~ {endDate}끝날짜 ({day}9박)
          <br />소 {selected1} 9자리, 중 {selected2} 9자리, 대 {selected3}{" "}
          9자리, 카라반 {selected4} 9자리
        </ItemDetails>
        <ItemDetails type="price" size="reserved">
          {sumPrice}99,999
        </ItemDetails>
        <ItemDetails type="unit" size="reserved">
          원 ~
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
