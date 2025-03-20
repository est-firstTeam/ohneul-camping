import right_arr from "../images/ico-rightArrow.svg";
import mapico from "../images/ico-map.svg";
import calico from "../images/ico-calendar.svg";
import siteico from "../images/ico-vector.svg";
import Button from "./Button";
import { useRef, useState } from "react";
import Modal from "./Modal";
import DateModal from "./DateModal";

// 지역 옵션 배열
const locations = [
    "전체",
    "서울시",
    "인천시",
    "경기도",
    "강원도",
    "대전시",
    "세종시",
    "대구시",
    "부산시",
    "울산시",
    "전주시",
    "광주시",
    "충청남도",
    "충청북도",
    "전라남도",
    "전라북도",
    "경상남도",
    "경상북도",
    "제주도",
];

// 사이트 옵션 배열
const sites = ["소(1~3인)", "중(4~6인)", "대(7~10인)", "카라반(1~4인)"];

const SearchBar = () => {
    const locationModal = useRef(null); // 위치 모달 관리
    const dateModal = useRef(null); // 날짜 및 일정 모달 관리
    const siteModal = useRef(null); // 캠프 사이트 모달 관리
    const [activeLocation, setActiveLocation] = useState(0); // 위치 컨텐츠 버튼 상태 관리
    const [activeSite, setActiveSite] = useState(0); // 캠프 사이트 버튼 상태 관리

    // 위치 모달 열기
    const openLocationModal = () => {
        if (locationModal.current) {
            locationModal.current.showModal();
        }
    };

    // 날짜 및 일정 모달 열기
    const openDateModal = () => {
        if (dateModal.current) {
            dateModal.current.showModal();
        }
    };

    // 캠핑 사이트 모달 열기
    const openSiteModal = () => {
        if (siteModal.current) {
            siteModal.current.showModal();
        }
    };

    // 검색바 버튼 옵션 배열
    const searchBarButtons = [
        {
            label: "어디로 가세요?",
            icon: <img src={mapico} width={"20px"} height={"20px"} />,
            onClick: openLocationModal,
        },
        {
            label: "날짜 및 일정",
            icon: <img src={calico} width={"20px"} height={"20px"} />,
            onClick: openDateModal,
        },
        {
            label: "사이트 형태",
            icon: <img src={siteico} width={"20px"} height={"20px"} />,
            onClick: openSiteModal,
        },
    ];

    return (
        <>
            {/* 검색 바 */}
            <div className="search__bar">
                {searchBarButtons.map((button, index) => (
                    <Button
                        key={index}
                        className="btn-searchbar"
                        color="secondary"
                        iconPosition="left"
                        icon={button.icon}
                        onClick={button.onClick}
                    >
                        {button.label}
                    </Button>
                ))}
                <Button
                    color={"primary"}
                    icon={<img src={right_arr} />}
                    iconPosition="right"
                >
                    검색
                </Button>
            </div>

            {/* 지역 선택 모달 창 */}
            <Modal modalRef={locationModal}>
                <div className="modal__location">
                    <div className="modal__header">
                        <img src={mapico} />
                        <h2 className="location__title">어디로 가세요?</h2>
                    </div>
                    <div className="location__content">
                        {locations.map((location, index) => (
                            <Button
                                key={index}
                                className={`btn-content ${
                                    activeLocation === index ? "active" : null
                                }`}
                                color={"secondary"}
                                onClick={() => setActiveLocation(index)}
                            >
                                <span className="content__name">
                                    {location}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* 날짜 모달 창 */}
            <DateModal modalRef={dateModal} />

            {/* 캠핑 모달 창 */}
            <Modal modalRef={siteModal}>
                <div className="modal__site">
                    <h2 className="site__title">캠핑 사이트</h2>
                    <div className="site__container">
                        {sites.map((site, index) => (
                            <Button
                                key={index}
                                className={`btn-content ${
                                    activeSite === index ? "active" : null
                                }`}
                                color={"secondary"}
                                onClick={() => setActiveSite(index)}
                            >
                                <span className="content__name">{site}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SearchBar;
