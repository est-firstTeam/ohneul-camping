import ItemDetails from "./ItemDetails";
import React from "react";
import noImage from "./../images/no_image.png";
import { Link, useParams } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "framer-motion"; // eslint-disable-line no-unused-vars
// import { useMotionValueEvent, useScroll } from "framer-motion";

// Campsite 컬렉션
// doNm, facltNm, firstImageUrl, induty, sigunguNm, caravSiteCo, siteMg1Co, siteMg2Co, siteMg3Co
// 가격은 siteMg1CoPrice ~ caravSiteCoPrice 사용

// Available_RSV 컬렉션
// siteS, siteM, siteL, siteC, ... (선택 날짜에 따라 변경되는 값)

const ProductList = ({ campSiteData }) => {
  const { site } = useParams();

  return (
    <div className="product-list">
      {campSiteData.map((camp) => {
        const { siteS, siteM, siteL, siteC } = camp;
        const availableSites = [
          siteS !== null && `소 ${siteS}자리`,
          siteM !== null && `중 ${siteM}자리`,
          siteL !== null && `대 ${siteL}자리`,
          siteC !== null && `카라반 ${siteC}자리`,
        ];
        const sitesSort = availableSites.filter(Boolean).join("/ ");

        return (
          <Link to={`/searchResult/${camp.contentId}`}>
            <motion.div
              key={camp.contentId}
              className="product product--w35"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, delay: 0 }}
              viewport={{ once: false }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
                y: { duration: 0.3 },
              }}
            >
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

                {/* stock={true} : 남은 자리 표시 */}
                {sitesSort && (
                  <>
                    <ItemDetails type="title" size="small">
                      남은 자리
                    </ItemDetails>
                    <ul>
                      <React.Fragment>
                        <>
                          <ItemDetails type="text" color="black">
                            {sitesSort}
                          </ItemDetails>
                        </>
                      </React.Fragment>
                    </ul>
                  </>
                )}

                {/* 가격 */}
                {/* 메인에서는 판매하는 소,중,대,카라반 데이터 중 제일 저렴한 값을 보이게 하기 */}
                {/* ㄴ재고 무관하게! */}
                {/* ㄴ만약 전일 매진이면/ 모든 재고가 0이라면 → 품절표시? */}
                <ItemDetails type="price" size="default">
                  {site === "소(1~3인)" && <>{camp.siteSPrice}</>}
                  {site === "중(4~6인)" && <>{camp.siteMPrice}</>}
                  {site === "대(7~10인)" && <>{camp.siteLPrice}</>}
                  {site === "카라반(1~4인)" && <>{camp.siteCPrice}</>}
                </ItemDetails>
                <ItemDetails type="unit" size="default">
                  원 ~
                </ItemDetails>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductList;
