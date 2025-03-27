import React from "react";
import { monthDateFormat } from "../util/util.js";

const DetailOptionBox = ({
  startDate,
  endDate,
  siteCounts,
  campData,
  nightCount,
}) => {
  return (
    startDate &&
    endDate &&
    siteCounts.some((count) => count > 0) && (
      <div className="detail__overview--optionbox">
        <span className="detail__overview--optionbox-option">옵션</span>
        <h5 className="detail__overview--optionbox-date">
          예약 일자 : {monthDateFormat(startDate)} ~ {monthDateFormat(endDate)}(
          {nightCount}박)
        </h5>
        <ul className="detail__overview--optionbox-size">
          {siteCounts.map((count, index) => {
            if (count > 0) {
              const siteNames = [
                "소 (최대 3인)",
                "중 (최대 6인)",
                "대 (최대 10인)",
                "카라반 (최대 4인)",
              ];

              let price = 0;
              if (index === 0) {
                price = count * campData.siteSPrice * nightCount; // 소
              } else if (index === 1) {
                price = count * campData.siteMPrice * nightCount; // 중
              } else if (index === 2) {
                price = count * campData.siteLPrice * nightCount; // 대
              } else if (index === 3) {
                price = count * campData.siteCPrice * nightCount; // 카라반
              }

              return (
                <li key={index} className="detail__overview--optionbox-item">
                  <span className="site-name">{siteNames[index]} :</span>
                  <span className="site-count">{count} 자리</span>
                  <span className="site-price">{price.toLocaleString()}원</span>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    )
  );
};

export default DetailOptionBox;
