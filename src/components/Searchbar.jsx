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
import { useQuery } from "@tanstack/react-query";

const SearchBar = () => {
  const locationModal = useRef(null); // 위치 모달 관리
  const dateModal = useRef(null); // 날짜 및 일정 모달 관리
  const siteModal = useRef(null); // 캠프 사이트 모달 관리
  // const [siteEx, setSiteEx] = useState(""); // 사이트 선택
  const [enabled, setEnabled] = useState(false);

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
      // onValue: siteEx,
      onValue: searchValue.site,
    },
  ];

  // const test = () => {};

  // const handleClick = useCallback(() => {
  //   setEnabled(false);
  // }, [setEnabled]);

  const { data: siteArr } = useQuery({
    queryKey: ["siteArr"],
    queryFn: () =>
      fBService.getSearchARSV(searchValue.location, searchValue.startDate),
    enabled: enabled,
    select: (siteArr) => {
      return siteArr[0].data.content.filter((item) => {
        if (searchValue.site === "소(1~3인)") {
          return item.siteS !== null;
        }
        if (searchValue.site === "중(4~6인)") {
          return item.siteM !== null;
        }
        if (searchValue.site === "대(7~10인)") {
          return item.siteL !== null;
        }
        if (searchValue.site === "카라반(1~4인)") {
          return item.siteC !== null;
        }
        return false;
      });
    },
  });

  // console.log(enabled);
  console.log(siteArr);

  // useEffect(() => {
  //   setSearchResult(siteArr);
  // }, [searchValue]);

  // 검색
  // const fetchSearch = async () => {
  //   try {
  //     // 캠핑 예약 가능한 사이트 개수 불러오기
  //     // setSite(siteEx);
  //     // if (searchValue.location !== "전체") {
  //     // const siteArr = await fBService.getSearchARSV(
  //     //   searchValue.location,
  //     //   searchValue.startDate
  //     // );
  //     // 지역별로 검색하기
  //     // console.log(siteArr);
  //     // // 검색 결과 있을 때
  //     // if (siteArr[0]) {
  //     //   console.log(siteArr[0].data.content);
  //     //   // 소/중/대/카라반 사이트 별 검색 필터링
  //     //   const filteredData = siteArr[0].data.content.filter((item) => {
  //     //     if (searchValue.site === "소(1~3인)") {
  //     //       return item.siteS !== null;
  //     //     } else if (searchValue.site === "중(4~6인)") {
  //     //       return item.siteM !== null;
  //     //     } else if (searchValue.site === "대(7~10인)") {
  //     //       return item.siteL !== null;
  //     //     } else if (searchValue.site === "카라반(1~4인)") {
  //     //       return item.siteC !== null;
  //     //     } else {
  //     //       setSearchResult([]);
  //     //     }
  //     //   });
  //     //   console.log(filteredData);
  //     //   setSearchResult(filteredData);
  //     // }
  //     // // 검색 결과 없을 때
  //     // else {
  //     //   setSearchResult([]);
  //     // }
  //     // }
  //     // else if (searchValue.location === "전체") {
  //     //   const siteArr = await fBService.getSearchAllARSV(searchValue.startDate);
  //     //   console.log(siteArr);
  //     //   // 검색 결과 있을 때
  //     //   if (siteArr[0]) {
  //     //     console.log(siteArr[0].data.content);
  //     //     // 소/중/대/카라반 사이트 별 검색 필터링
  //     //     const filteredData = siteArr[0].data.content.filter((item) => {
  //     //       if (searchValue.site === "소(1~3인)") {
  //     //         return item.siteS !== null;
  //     //       } else if (searchValue.site === "중(4~6인)") {
  //     //         return item.siteM !== null;
  //     //       } else if (searchValue.site === "대(7~10인)") {
  //     //         return item.siteL !== null;
  //     //       } else if (searchValue.site === "카라반(1~4인)") {
  //     //         return item.siteC !== null;
  //     //       } else {
  //     //         setSearchResult([]);
  //     //       }
  //     //     });
  //     //     console.log(filteredData);
  //     //     setSearchResult(filteredData);
  //     //   }
  //     //   // 검색 결과 없을 때
  //     //   else {
  //     //     setSearchResult([]);
  //     //   }
  //     // }
  //   } catch (error) {
  //     console.error("검색 오류", error);
  //   }
  // };

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
        searchValue.site ? (
          <>
            <Button
              color={"primary"}
              icon={<img src={right_arr} />}
              iconPosition="right"
              onClick={() => {
                setEnabled(true);
                setTimeout(() => {
                  setEnabled(false);
                }, 1000);
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
                onClick={(e) => setSite(e.target.value)}
                // onClick={(e) => setSiteEx(e.target.value)}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SearchBar;
