import right_arr from "../images/ico-rightArrow.svg";
import mapico from "../images/ico-map.svg";
import calico from "../images/ico-calendar.svg";
import siteico from "../images/ico-vector.svg";
import Button from "./Button";
import { useRef } from "react";
import Modal from "./Modal";
import DateModal from "./DateModal";
import Chip from "./Chip";
import useSearchStore from "../store/useSearchStore";
import { useNavigate } from "react-router-dom";
import SearchBarButton from "./SearchBarButton";

const SearchBar = () => {
  const navigate = useNavigate();
  const locationModal = useRef(null); // 위치 모달 관리
  const dateModal = useRef(null); // 날짜 및 일정 모달 관리
  const siteModal = useRef(null); // 캠프 사이트 모달 관리

  const {
    locations,
    sites,
    searchValue,
    setCancel,
    setLocation,
    setStartDate,
    setEndDate,
    setSite,
  } = useSearchStore();

  // 모달 열기
  const openModal = (currentModal) => {
    if (currentModal.current) {
      currentModal.current.showModal();
    }
  };

  // 검색바 버튼 옵션 배열
  const searchBarButtons = [
    {
      name: "location",
      label: "어디로 가세요?",
      icon: <img src={mapico} width={"20px"} height={"20px"} />,
      onClick: () => openModal(locationModal),
      onValue: searchValue.location,
    },
    {
      name: "date",
      label: "날짜 및 일정",
      icon: <img src={calico} width={"20px"} height={"20px"} />,
      onClick: () => openModal(dateModal),
      onValue:
        searchValue.startDate && searchValue.endDate
          ? `${searchValue.startDate} ~ ${searchValue.endDate}`
          : null,
    },
    {
      name: "site",
      label: "사이트 형태",
      icon: <img src={siteico} width={"20px"} height={"20px"} />,
      onClick: () => openModal(siteModal),
      onValue: searchValue.site,
    },
  ];

  return (
    <>
      {/* 검색 바 */}
      <div className="search__bar">
        {searchBarButtons.map((sButton, index) => (
          <SearchBarButton
            key={index}
            className={`searchbutton-${sButton.name}`}
            color="secondary"
            iconPosition="left"
            icon={sButton.icon}
            onClick={sButton.onClick}
          >
            {sButton.onValue ? <>{sButton.onValue}</> : <>{sButton.label}</>}
          </SearchBarButton>
        ))}
        {searchValue.location &&
        searchValue.startDate &&
        searchValue.endDate &&
        searchValue.site ? (
          <>
            <Button
              color={"primary"}
              icon={<img src={right_arr} />}
              iconPosition="right"
              onClick={() => {
                {
                  navigate(
                    `/searchResult/${searchValue.location}/${searchValue.startDate}/${searchValue.endDate}/${searchValue.site}`
                  );
                  // window.location.reload();
                }
              }}
            >
              검색
            </Button>
          </>
        ) : (
          <>
            <Button
              color={"primary"}
              icon={<img src={right_arr} />}
              iconPosition="right"
              disabled={"disabled"}
            >
              검색
            </Button>
          </>
        )}
      </div>

      {/* 지역 선택 모달 창 */}
      <Modal
        modalRef={locationModal}
        handleCancel={() => setCancel("location")}
        text={"완료"}
        cancelBtn
        confirmBtn
      >
        <div className="modal__location">
          <div className="modal__header">
            <img src={mapico} />
            <h2 className="location__title">어디로 가세요?</h2>
          </div>
          <div className="location__content">
            {locations.map((location, index) => (
              <Chip
                key={index}
                chipValue={location}
                groupName="캠핑 사이트"
                onClick={(e) => setLocation(e.target.value)}
                chipText={location}
              />
            ))}
          </div>
        </div>
      </Modal>

      {/* 날짜 모달 창 */}
      <DateModal
        modalRef={dateModal}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleCancel={() => {
          setCancel("startDate");
          setCancel("endDate");
        }}
      />

      {/* 캠핑 모달 창 */}
      <Modal
        modalRef={siteModal}
        handleCancel={() => setCancel("site")}
        text={"완료"}
        cancelBtn
        confirmBtn
      >
        <div className="modal__site">
          <h2 className="site__title">캠핑 사이트</h2>
          <div className="site__container">
            {sites.map((site, index) => (
              <Chip
                key={index}
                chipValue={site}
                groupName="캠핑 사이트"
                onClick={(e) => setSite(e.target.value)}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SearchBar;
