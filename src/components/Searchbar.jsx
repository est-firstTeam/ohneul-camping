import right_arr from "../images/ico-rightArrow.svg";
import mapico from "../images/ico-map.svg";
import calico from "../images/ico-calendar.svg";
import siteico from "../images/ico-vector.svg";
import Button from "./Button";
import { useRef } from "react";
import Modal from "./Modal";
import DateModal from "./DateModal";

const SearchBar = () => {
    const locationModal = useRef(null); // 위치 모달 관리
    const dateModal = useRef(null); // 날짜 및 일정 모달 관리
    const siteModal = useRef(null); // 캠프 사이트 모달 관리

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

    return (
        <>
            {/* 검색 바 */}
            <div className="search__bar">
                <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    icon={<img src={mapico} width={"20px"} height={"20px"} />}
                    iconPosition="left"
                    onClick={openLocationModal}
                >
                    어디로 가세요?
                </Button>
                <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    icon={<img src={calico} width={"20px"} height={"20px"} />}
                    iconPosition="left"
                    onClick={openDateModal}
                >
                    날짜 및 일정
                </Button>
                <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    icon={<img src={siteico} width={"20px"} height={"20px"} />}
                    iconPosition="left"
                    onClick={openSiteModal}
                >
                    사이트 형태
                </Button>
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
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">전체</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">서울특별시</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">충청남도</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">울산광역시</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">인천광역시</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">경기도</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">대구광역시</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">
                                강원특별자치도
                            </span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">부산광역시</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">대전광역시</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">
                                세종특별자치시
                            </span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">광주광역시</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">충청남도</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">전라남도</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">충청북도</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">경상북도</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">경상남도</span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">
                                전북특별자치도
                            </span>
                        </Button>
                        <Button
                            className={"btn-locationcontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">
                                제주특별자치도
                            </span>
                        </Button>
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
                        <Button
                            className={"btn-sitecontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">소(1~3인)</span>
                        </Button>
                        <Button
                            className={"btn-sitecontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">중(4~6인)</span>
                        </Button>

                        <Button
                            className={"btn-sitecontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">대(7~10인)</span>
                        </Button>

                        <Button
                            className={"btn-sitecontent"}
                            color={"secondary"}
                        >
                            <span className="content__name">카라반(1~4인)</span>
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SearchBar;
