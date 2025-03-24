import ItemDetails from "./ItemDetails";
import React from "react";
import noImage from "./../images/no_image.png";
import useCampsiteData from "../hooks/useCampsiteData";

// Campsite 컬렉션
// doNm, facltNm, firstImageUrl, induty, sigunguNm, caravSiteCo, siteMg1Co, siteMg2Co, siteMg3Co
// 가격은 siteMg1CoPrice ~ caravSiteCoPrice 사용

// Available_RSV 컬렉션
// siteS, siteM, siteL, siteC, ... (선택 날짜에 따라 변경되는 값)

const ProductList = ({ stock, limit }) => {
  const { campsiteData } = useCampsiteData();

  const displayedData = campsiteData.slice(0, limit || 1);

  return (
    <div className="product-list">
      {displayedData.map((camp) => {
        const { siteMg1Co, siteMg2Co, siteMg3Co, caravSiteCo } = camp.data;
        // 재고 옵션
        // 현재 넣어둔 데이터는 임시(Campsite 컬렉션 데이터)
        // 검색 결과 페이지에서는
        // [최대 재고 - 예약 수] = [남은 재고] 로 변경해줘야함
        // 아예 옵션이 존재하지 않는 경우 : Campsite 데이터 값이 0임
        // 품절돼서 0인 경우 : [최대재고-예약수 = 0]이어야 함
        const stockData = [
          { label: "소", value: siteMg1Co },
          { label: "중", value: siteMg2Co },
          { label: "대", value: siteMg3Co },
          { label: "카라반", value: caravSiteCo },
        ];

        return (
          <div key={camp.id} className="product product--w35">
            <img
              src={camp.data.firstImageUrl || noImage}
              className="product__image"
            />
            <div className="detail-list">
              {/* 야영장 이름 */}
              <ItemDetails type="title" size="large">
                {camp.data.facltNm}
              </ItemDetails>

              {/* 경기도 양평군 / #글램핑 #야영장 */}
              <ItemDetails type="text" color="gray">
                {camp.data.doNm} {camp.data.sigunguNm}
                <br />
                {camp.data.induty &&
                  camp.data.induty.split(",").map((item, index) => (
                    <React.Fragment key={index}>
                      #{item.trim()}
                      {index !== camp.data.induty.split(",").length - 1 && " "}
                    </React.Fragment>
                  ))}
              </ItemDetails>

              {/* stock={true} : 남은 자리 표시 */}
              {stock && stockData.length > 0 && (
                <>
                  <ItemDetails type="title" size="small">
                    남은 자리
                  </ItemDetails>
                  <ul>
                    {stockData.map((stockItem, index) => (
                      <React.Fragment key={index}>
                        <ItemDetails type="text" color="black">
                          {stockItem.label} {stockItem.value}자리
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

              {/* 가격 */}
              {/* 메인에서는 판매하는 소,중,대,카라반 데이터 중 제일 저렴한 값을 보이게 하기 */}
              {/* ㄴ재고 무관하게! */}
              {/* ㄴ만약 전일 매진이면/ 모든 재고가 0이라면 → 품절표시? */}
              <ItemDetails type="price" size="default">
                {camp.data.price}9,999
              </ItemDetails>
              <ItemDetails type="unit" size="default">
                원 ~
              </ItemDetails>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
