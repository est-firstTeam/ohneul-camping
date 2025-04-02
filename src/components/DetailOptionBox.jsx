import React from "react";
import { monthDateFormat } from "../util/dateUtil.js";

const DetailOptionBox = ({
  startDate,
  endDate,
  siteCounts,
  siteSPrice,
  siteMPrice,
  siteLPrice,
  siteCPrice,
  nightCount,
}) => {
  const isInvalidDate = startDate === endDate;
  return (
    startDate &&
    endDate &&
    !isInvalidDate &&
    siteCounts.some((count) => count > 0) && (
      <div className="detail__overview--optionbox">
        <div className="detail__overview--optionheader">
          <span className="detail__overview--optionbox-option">옵션</span>
          <p className="detail__overview--optionbox-date">
            <b>예약 일자 </b> {monthDateFormat(startDate)} ~{" "}
            {monthDateFormat(endDate)}({nightCount}박)
          </p>
        </div>

        <ul className="detail__overview--optionbox-size">
          {siteCounts.map((count, index) => {
            if (count > 0) {
              const siteNames = ["소", "중", "대", "카라반"];

              const numArr = [
                "(최대 3인)",
                "(최대 6인)",
                "(최대 10인)",
                "(최대 4인)",
              ];

              let price = 0;
              if (index === 0) {
                price = count * siteSPrice * nightCount; // 소
              } else if (index === 1) {
                price = count * siteMPrice * nightCount; // 중
              } else if (index === 2) {
                price = count * siteLPrice * nightCount; // 대
              } else if (index === 3) {
                price = count * siteCPrice * nightCount; // 카라반
              }

              return (
                <li key={index} className="detail__overview--optionbox-item">
                  <span className="site-name">
                    {siteNames[index]}
                    <span className="site-num"> {numArr[index]}</span> : {count}{" "}
                    자리
                  </span>
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
