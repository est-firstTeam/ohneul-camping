import ItemDetails from "./ItemDetails";
import React from "react";

// 상품 리스트 (수정 후)
const ProductList = ({
  firstImageUrl,
  facltNm,
  doNm,
  sigunguNm,
  induty,
  siteMg1Co,
  siteMg2Co,
  siteMg3Co,
  caravSiteCo,
  price, // 상품 (최소) 가격
  stock, // 재고 (메인: false / 검색결과: true)
}) => {
  const stockData = [
    { label: "소", value: siteMg1Co },
    { label: "중", value: siteMg2Co },
    { label: "대", value: siteMg3Co },
    { label: "카라반", value: caravSiteCo },
  ];

  return (
    <div className="product product--w35">
      <img src={firstImageUrl} className="product__image" />
      <div className="detail-list">
        <ItemDetails type="title" size="large">
          {facltNm} 야영장의 이름
        </ItemDetails>
        <ItemDetails type="text" color="gray">
          {doNm} {sigunguNm} (예시: 전라남도 담양시)
          <br /> (예시: #글램핑 #카라반)
          {/* (예시) "induty": "일반야영장,카라반,글램핑" */}
          {/* → #일반야영장 #카라반 #글램핑 */}
          {/* 1. #는 쉼표로 구분 2. 값이 undefined면 출력X */}
          {induty &&
            induty.split(",").map((item, index) => (
              <React.Fragment key={index}>
                #{item.trim()}
                {index !== induty.split(",").length - 1 && " "}
              </React.Fragment>
            ))}
        </ItemDetails>

        {/* true => SearchResult */}
        {/* false => Main */}
        {stock && (
          <>
            <ItemDetails type="title" size="small">
              남은 자리
            </ItemDetails>
            <ul>
              {stockData.map((stock, index) => (
                <React.Fragment key={index}>
                  <ItemDetails type="text" color="black">
                    {stock.label} {stock.value}자리
                  </ItemDetails>
                  {index !== stockData.length - 1 && (
                    <ItemDetails type="text" color="black">
                      /
                    </ItemDetails>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </>
        )}

        <ItemDetails type="price" size="default">
          {price}9,999
        </ItemDetails>
        <ItemDetails type="unit" size="default">
          원 ~
        </ItemDetails>
      </div>
    </div>
  );
};

export default ProductList;
