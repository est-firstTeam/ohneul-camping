import Modal from "./Modal";
import "react-date-range/dist/styles.css"; // 달력 main css file
import "react-date-range/dist/theme/default.css"; // 달력 theme css file
import { DateRange } from "react-date-range";
import { useState } from "react";

// 날짜 및 일정 관리하는 모달
const DateModal = ({ modalRef }) => {
    // 달력 라이브러리 상태 관리
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: "selection",
        },
    ]);

    return (
        <Modal modalRef={modalRef}>
            <div className="modal__date">
                <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setState([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                    months={2} // 2달 보여주기
                    direction="horizontal" // 수평(가로)로 보여주기
                    minDate={new Date()} // 오늘을 기준으로 이전날은 선택불가
                />
            </div>
        </Modal>
    );
};

export default DateModal;
