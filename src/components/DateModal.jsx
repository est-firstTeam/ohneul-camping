import Modal from "./Modal";
import "react-date-range/dist/styles.css"; // 달력 main css file
import "react-date-range/dist/theme/default.css"; // 달력 theme css file
import { DateRange } from "react-date-range";
import { useState } from "react";

// 날짜 및 일정 관리하는 모달
const DateModal = ({ modalRef, setStartDate, setEndDate, handleCancel }) => {
  // 달력 라이브러리 상태 관리
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  // 날짜 선택 핸들러 추가
  const handleDateChange = (item) => {
    setState([item.selection]);
    setStartDate(
      item.selection.startDate
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, "-")
        .replace(".", "")
    );
    setEndDate(
      item.selection.endDate
        ? item.selection.endDate
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "")
        : null
    );
  };

  return (
    <Modal modalRef={modalRef} handleCancel={handleCancel}>
      <div className="modal__date">
        <DateRange
          editableDateInputs={true}
          onChange={handleDateChange}
          moveRangeOnFirstSelection={false}
          ranges={state}
          months={1} // 2달 보여주기
          minDate={new Date()} // 오늘을 기준으로 이전날은 선택불가
        />
      </div>
    </Modal>
  );
};

export default DateModal;
