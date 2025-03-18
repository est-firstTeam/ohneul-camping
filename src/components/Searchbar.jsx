import right_arr from "../images/ico-rightArrow.svg";
import mapico from "../images/ico-map.svg";
import calico from "../images/ico-calendar.svg";
import siteico from "../images/ico-vector.svg";
import Button from "./Button";
import { useRef } from "react";
import Modal from "./Modal";

const SearchBar = () => {
    const siteModal = useRef(null);

    // 캠핑 사이트 모달 열기
    const openSiteModal = () => {
        if (siteModal.current) {
            siteModal.current.showModal();
        }
    };

    return (
        <>
            <div className="search__bar">
                <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    icon={<img src={mapico} width={"20px"} height={"20px"} />}
                    iconPosition="left"
                >
                    어디로 가세요?
                </Button>
                <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    icon={<img src={calico} width={"20px"} height={"20px"} />}
                    iconPosition="left"
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
