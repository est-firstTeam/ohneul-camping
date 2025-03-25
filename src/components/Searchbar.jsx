import right_arr from "../images/ico-rightArrow.svg";
import mapico from "../images/ico-map.svg";
import calico from "../images/ico-calendar.svg";
import siteico from "../images/ico-vector.svg";
import Button from "./Button";
import { useRef, useState } from "react";
import Modal from "./Modal";
import DateModal from "./DateModal";
import Chip from "./Chip";
import useSearchStore from "../store/useSearchStore";
import { fBService } from "../util/fbService";

const SearchBar = () => {
  const locationModal = useRef(null); // 위치 모달 관리
  const dateModal = useRef(null); // 날짜 및 일정 모달 관리
  const siteModal = useRef(null); // 캠프 사이트 모달 관리
  const [siteEx, setSiteEx] = useState(""); // 사이트 선택

  const {
    locations,
    sites,
    searchValue,
    setCancel,
    setLocation,
    setStartDate,
    setEndDate,
    setSite,
    setSearchResult,
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
      onValue: siteEx,
    },
  ];

  // 검색
  const fetchSearch = async () => {
    try {
      // 1. 캠핑 예약 가능한 사이트 개수 불러오기
      setSite(siteEx);
      const siteArr = await fBService.getSearchARSV(
        searchValue.location,
        searchValue.startDate
      );
      console.log(siteArr);
      console.log(
        siteArr.flatMap((content) =>
          content.data.content.map((item) => item.contentId)
        )
      );
      // flatMap을 사용안하면 배열이 중첩된 상태 그대로 출력된다.
      // console.log(
      //   snapShot.docs.map((doc) => doc.data()).map((item) => item.content)
      // );

      // 2. 캠핑 사이트 정보 불러오기
      let campArr = [];
      const contentIdArray = siteArr.flatMap((content) =>
        content.data.content.map((item) => item.contentId)
      );
      console.log(contentIdArray);
      for (let id of contentIdArray) {
        const filteredCampData = await fBService.getSearchCampSite(id);
        const filteredCampData2 = filteredCampData[0];
        campArr.push(filteredCampData2);
      }

      console.log(
        siteArr.flatMap((site) => site.data.content.map((item) => item))
      );
      console.log(campArr.map((camp) => camp.data));

      // // 3. 캠핑 예약 가능한 사이트 개수 & 캠핑 사이트 정보 매칭하기
      const matched = siteArr.flatMap((site) =>
        site.data.content.map((item) => {
          const campInfo = campArr.find(
            (camp) => camp.data.contentId === item.contentId
          );
          return { data: { ...item, ...campInfo.data } };
        })
      );

      setSearchResult(matched);
    } catch (error) {
      console.error("검색 오류", error);
    }
  };

  return (
    <>
      {/* 검색 바 */}
      <div className="search__bar">
        {searchBarButtons.map((sButton, index) => (
          <Button
            key={index}
            className={`btn-searchbar`}
            color="secondary"
            iconPosition="left"
            icon={sButton.icon}
            onClick={sButton.onClick}
          >
            {sButton.onValue ? <>{sButton.onValue}</> : <>{sButton.label}</>}
          </Button>
        ))}
        {searchValue.location &&
        searchValue.startDate &&
        searchValue.endDate &&
        siteEx ? (
          <>
            <Button
              color={"primary"}
              icon={<img src={right_arr} />}
              iconPosition="right"
              onClick={fetchSearch}
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
      <Modal modalRef={siteModal} handleCancel={() => setCancel("site")}>
        <div className="modal__site">
          <h2 className="site__title">캠핑 사이트</h2>
          <div className="site__container">
            {sites.map((site, index) => (
              <Chip
                key={index}
                chipValue={site}
                groupName="캠핑 사이트"
                // onClick={(e) => setSite(e.target.value)}
                onClick={(e) => setSiteEx(e.target.value)}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SearchBar;
