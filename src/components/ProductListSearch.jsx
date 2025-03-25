import noImage from "./../images/no_image.png";
import ItemDetails from "./ItemDetails";
import React from "react";

const ProductSearchList = ({ campSiteData }) => {
  console.log(campSiteData);
  return (
    <>
      {campSiteData &&
        campSiteData.map((camp) => (
          <div key={camp.contentId} className="product product--w35">
            <img
              src={camp.firstImageUrl || noImage}
              className="product__image"
            />
            <div className="detail-list">
              {/* 야영장 이름 */}
              <ItemDetails type="title" size="large">
                {camp.facltNm}
              </ItemDetails>

              {/* 경기도 양평군 / #글램핑 #야영장 */}
              <ItemDetails type="text" color="gray">
                {camp.doNm} {camp.sigunguNm}
                <br />
                {camp.induty &&
                  camp.induty.split(",").map((item, index) => (
                    <React.Fragment key={index}>
                      #{item.trim()}
                      {index !== camp.induty.split(",").length - 1 && " "}
                    </React.Fragment>
                  ))}
              </ItemDetails>

              <ItemDetails type="title" size="small">
                남은 자리
              </ItemDetails>
              <ul>
                {stockData.map((stockItem, index) => (
                  <React.Fragment key={index}>
                    {stockItem.value !== 0 && (
                      <>
                        <ItemDetails type="text" color="black">
                          {stockItem.label} {stockItem.value}자리
                        </ItemDetails>
                        {index !== stockData.length - 1 && (
                          <ItemDetails type="text" color="black">
                            /
                          </ItemDetails>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </div>
        ))}
    </>
  );
};

export default ProductSearchList;
