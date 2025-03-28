import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import calico from "../images/ico-calendar.svg";
import siteico from "../images/ico-vector.svg";
import addCart from "../images/ico-addCart.svg";
import Topbtn from "../components/Topbtn";
import DateModal from "../components/DateModal";
import DTsiteModal from "../components/DTsiteModal";
import useSiteStore from "../store/useSiteStore";
import DetailOptionBox from "../components/DetailOptionBox";
import { firebaseAPI } from "../util/firebaseApi";
import DetailInfo from "../components/DetailInfo";
import DetailFacility from "../components/DetailFacility";
import { firebaseDB } from "../firebaseConfig";
import { getDaysBetweenDates } from "../util/util.js";
import SearchBarButton from "../components/SearchBarButton.jsx";
import noImage from "./../images/no_image.png";
import { useUserStore } from "../store/useUserStore.js";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal.jsx";

const DetailPage = () => {
  const { id } = useParams();
  const dateModal = useRef(null);
  const siteModal = useRef(null);
  const cartModal = useRef(null);
  const { siteCounts } = useSiteStore();
  const resetSiteCounts = useSiteStore((state) => state.resetSiteCounts);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [availableSites, setAvailableSites] = useState(null);
  const [minAvailable, setMinAvailable] = useState(null);

  const { data: campData } = useQuery({
    queryKey: ["campData", id],
    queryFn: async () => {
      const allDocs = await firebaseAPI.getAllDocs("Available_RSV");
      for (const doc of allDocs) {
        const contentArray = doc.data.content || [];
        const matchedContent = contentArray.find(
          (item) => item.contentId === id
        );
        if (matchedContent) return matchedContent;
      }
      throw new Error("해당 contentId에 대한 데이터 없음");
    },
    enabled: !!id,
  });

  const userId = useUserStore((state) => state.id);
  const mutation = useMutation({
    mutationFn: async ({ startDate, endDate, siteCounts, totalPrice }) => {
      const userRef = doc(firebaseDB, "User", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const carts = userData.carts || [];

        carts.push({
          campSiteId: campData.contentId,
          firstImageUrl: campData.firstImageUrl,
          rsvStartDate: startDate,
          rsvEndDate: endDate,
          rsvSiteS: siteCounts[0] || 0,
          rsvSiteM: siteCounts[1] || 0,
          rsvSiteL: siteCounts[2] || 0,
          rsvSiteC: siteCounts[3] || 0,
          facltNm: campData.facltNm,
          rsvTotalPrice: totalPrice,
          doNm: campData.doNm,
        });

        await updateDoc(userRef, { carts });
      }
    },
  });

  useEffect(() => {
    return () => {
      resetSiteCounts(); // 페이지 이동 시 site 개수 초기화
    };
  }, []);

  useEffect(() => {
    resetSiteCounts(); // startDate 값이 변경되면 site 개수 초기화
  }, [startDate]);

  const nightCount = getDaysBetweenDates(startDate, endDate);
  const totalPrice = siteCounts.reduce((sum, count, index) => {
    let pricePerSite =
      [
        campData?.siteSPrice,
        campData?.siteMPrice,
        campData?.siteLPrice,
        campData?.siteCPrice,
      ][index] || 0;
    return sum + count * pricePerSite * nightCount;
  }, 0);

  const fetchSiteCountsEachDate = async (
    location,
    startDate,
    endDate,
    contentId
  ) => {
    if (!location || !startDate || !endDate || !contentId) return {};

    // 날짜 리스트 생성
    const getDatesInRange = (start, end) => {
      const dateArray = [];
      let currentDate = new Date(start);
      const endDateObj = new Date(end);
      endDateObj.setDate(endDateObj.getDate() - 1);

      while (currentDate <= endDateObj) {
        dateArray.push(
          currentDate
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(".", "")
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dateArray;
    };

    const dateList = getDatesInRange(startDate, endDate);
    let datesAvailability = {};

    // Firebase 문서 조회
    const docIds = dateList.map((date) => `${location}_${date}`);
    const docRefs = docIds.map((docId) =>
      doc(firebaseDB, "Available_RSV", docId)
    );
    const docSnapshots = await Promise.all(
      docRefs.map((docRef) => getDoc(docRef))
    );

    // 데이터 처리
    docSnapshots.forEach((docSnap, index) => {
      const date = dateList[index];

      if (docSnap.exists()) {
        const data = docSnap.data();
        const matchedContent = data?.content?.find(
          (item) => item.contentId === contentId
        );

        if (matchedContent) {
          datesAvailability[date] = {
            siteS: matchedContent.siteS,
            siteM: matchedContent.siteM,
            siteL: matchedContent.siteL,
            siteC: matchedContent.siteC,
          };
        } else {
          datesAvailability[date] = { siteS: 0, siteM: 0, siteL: 0, siteC: 0 };
        }
      } else {
        datesAvailability[date] = { siteS: 0, siteM: 0, siteL: 0, siteC: 0 };
      }
    });

    return datesAvailability;
  };

  const getMinAvailableSites = (availableSites) => {
    return Object.keys(availableSites).reduce(
      (minSites, date) => {
        const dailyData = availableSites[date];

        // 최소값을 찾기 위해 현재 값과 비교 (null)
        minSites.siteS =
          dailyData.siteS === null
            ? null
            : Math.min(minSites.siteS, dailyData.siteS);
        minSites.siteM =
          dailyData.siteM === null
            ? null
            : Math.min(minSites.siteM, dailyData.siteM);
        minSites.siteL =
          dailyData.siteL === null
            ? null
            : Math.min(minSites.siteL, dailyData.siteL);
        minSites.siteC =
          dailyData.siteC === null
            ? null
            : Math.min(minSites.siteC, dailyData.siteC);
        return minSites;
      },
      // 비교를 위한 초기값 (min 값을 구하기 위한 initialize)
      { siteS: 10000, siteM: 10000, siteL: 10000, siteC: 10000 }
    );
  };

  // useEffect에서 호출
  useEffect(() => {
    if (!campData || !startDate || !endDate) return;

    const fetchData = async () => {
      const location = campData?.doNm;
      const contentId = campData?.contentId;
      const siteCountsByDate = await fetchSiteCountsEachDate(
        location,
        startDate,
        endDate,
        contentId
      );
      setAvailableSites(siteCountsByDate);

      console.log("날짜별 사이트 개수:", siteCountsByDate);
      const minAvailable = getMinAvailableSites(siteCountsByDate);
      console.log("최소 값 계산된 결과:", minAvailable);

      // DTsiteModal에 minAvailable 전달
      setMinAvailable(minAvailable);
    };

    fetchData();
  }, [startDate, endDate]);

  console.log("가능 개수", availableSites);

  // console.log("나 시작", startDate);
  // console.log("나 끝", endDate);
  // if (startDate && startDate !== endDate) {
  // const minAvailable = getMinAvailableSites(availableSites);
  // console.log("나 날짜 중에 최솟값", minAvailable);
  // }

  const openDateModal = () => {
    if (dateModal.current) {
      dateModal.current.showModal();
    }
  };
  // 자리 선택 모달 열기
  const openSiteModal = () => {
    if (siteModal.current) {
      siteModal.current.showModal();
    }
  };

  const openConfirmModal = () => {
    if (cartModal.current) {
      cartModal.current.showModal();
    }
  };

  const handleCloseModal = () => {
    if (cartModal.current) {
      cartModal.current.close();
    }
  };
  return (
    <section className="detail">
      {campData ? (
        <>
          <div className="detail__overview">
            <div className="detail__overview-image-box">
              <img
                className="detail__overview-image"
                src={campData.firstImageUrl || noImage}
                alt="캠핑장 사진"
              />
            </div>
            <div className="detail__overview-reserv">
              <h4 className="detail__overview-reserv--location">
                {campData.doNm} {campData.sigunguNm}
              </h4>

              <h2 className="detail__overview-reserv--title">
                {campData.facltNm}
              </h2>
              <h4 className="detail__overview-reserv--campstyle">
                {campData.induty}
              </h4>
              <h3 className="detail__overview-reserv--subtitle">
                {campData.themaEnvrnCl}
              </h3>
              <div className="detail__overview-reserv--option">
                {/* <h4 className="detail__overview-reserv--option-text">옵션</h4> */}
                <div className="btn-container">
                  <div className="btn-date">
                    <span className="btn-date-title">기간</span>
                    <SearchBarButton
                      className="searchbutton-site"
                      color="secondary"
                      iconPosition="left"
                      // padding={"1rem 15rem 1rem 1rem"}
                      icon={<img src={calico} width={"20px"} height={"20px"} />}
                      onClick={openDateModal}
                    >
                      날짜 선택
                    </SearchBarButton>
                  </div>
                  <DateModal
                    modalRef={dateModal}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                  />
                  <div className="btn-date">
                    <span className="btn-date-title">유형</span>
                    <SearchBarButton
                      className={"searchbutton-site"}
                      color={"secondary"}
                      iconPosition="left"
                      // margin={"1rem 0"}
                      // padding={"1rem 15rem 1rem 1rem"}
                      icon={
                        <img src={siteico} width={"20px"} height={"20px"} />
                      }
                      onClick={openSiteModal}
                    >
                      자리 선택
                    </SearchBarButton>
                  </div>
                  <DTsiteModal
                    modalRef={siteModal}
                    minAvailable={minAvailable}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>

                <DetailOptionBox
                  startDate={startDate}
                  endDate={endDate}
                  siteCounts={siteCounts}
                  nightCount={nightCount}
                  campData={campData}
                />

                <div className="detail__overview-reserv--payment">
                  <p className="detail__overview-reserv--payment-text">
                    총 상품 금액
                  </p>
                  <p className="detail__overview-reserv--payment-value">
                    <strong>{totalPrice.toLocaleString()}</strong> 원
                  </p>
                  {userId ? (
                    <>
                      <Button
                        className="detail__overview-reserv--addCartBtn"
                        icon={<img src={addCart} />}
                        padding={"0.6rem 5rem"}
                        onClick={() => {
                          mutation.mutate({
                            startDate,
                            endDate,
                            siteCounts,
                            totalPrice,
                          });
                          openConfirmModal();
                          resetSiteCounts(); // site 개수 초기화
                        }}
                        disabled={
                          !startDate ||
                          !endDate ||
                          siteCounts.every((count) => count === 0) // 날짜 또는 자리 선택 안 되어 있을 때
                        }
                      >
                        장바구니 담기
                      </Button>
                      <ConfirmModal
                        modalRef={cartModal}
                        handleClose={handleCloseModal}
                        startDate={startDate}
                        endDate={endDate}
                        totalPrice={totalPrice}
                        campData={campData}
                      />
                    </>
                  ) : (
                    <Link to="/login">
                      <Button
                        className="detail__overview-reserv--addCartBtn"
                        icon={<img src={addCart} />}
                        padding={"0.6rem 5rem"}
                      >
                        장바구니 담기
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="detail__add-on">
            <DetailFacility campData={campData} />
            <DetailInfo campData={campData} />
          </div>
        </>
      ) : (
        <p>로딩 중...</p>
      )}
      <Topbtn />
    </section>
  );
};

export default DetailPage;
