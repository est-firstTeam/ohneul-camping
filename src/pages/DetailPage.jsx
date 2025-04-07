import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
import DetailInfo from "../components/DetailInfo";
import DetailFacility from "../components/DetailFacility";
import { firebaseDB } from "../firebaseConfig";
import { fBService } from "../util/fbService";
import { getDaysBetweenDates } from "../util/dateUtil.js";
import { handleCancelModal, handleOpenModal } from "../util/modalUtil.js";
import SearchBarButton from "../components/SearchBarButton.jsx";
import noImage from "./../images/no_image.png";
import { useUserStore } from "../store/useUserStore.js";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal.jsx";
import useSearchStore from "../store/useSearchStore.js";

const DetailPage = () => {
  const { id } = useParams();
  const dateModal = useRef(null);
  const siteModal = useRef(null);
  const cartModal = useRef(null);
  const { siteCounts } = useSiteStore();
  const resetSiteCounts = useSiteStore((state) => state.resetSiteCounts);
  const { searchValue } = useSearchStore();
  const [startDate, setStartDate] = useState(searchValue.startDate);
  const [endDate, setEndDate] = useState(searchValue.endDate);
  const [minAvailable, setMinAvailable] = useState(null);

  const { data: campData } = useQuery({
    queryKey: ["campdata", id],
    queryFn: async () => await fBService.getCampsiteData(id),
    enabled: !!id,
  });

  const userId = useUserStore((state) => state.id);
  const setCarts = useUserStore((state) => state.setCarts);

  const mutation = useMutation({
    mutationFn: async ({ startDate, endDate, siteCounts, totalPrice }) => {
      const userRef = doc(firebaseDB, "User", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const carts = userData.carts || [];

        const newCart = {
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
        };

        carts.push(newCart);

        await updateDoc(userRef, { carts });

        setCarts([...carts]);
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
        campData?.siteMg1CoPrice,
        campData?.siteMg2CoPrice,
        campData?.siteMg3CoPrice,
        campData?.caravSiteCoPrice,
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
    const batchSize = 10;

    // Batch Query 사용 (최대 10개의 문서를 동시에 조회)
    for (let i = 0; i < dateList.length; i += batchSize) {
      const batchDates = dateList.slice(i, i + batchSize);
      const q = query(
        collection(firebaseDB, "Available_RSV"),
        //__name__ field는 full document path!
        where(
          "__name__",
          "in",
          batchDates.map((date) => `${location}_${date}`)
        )
      );

      const querySnapshot = await getDocs(q);

      // 조회 결과 처리
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const matchedContent = data?.content?.find(
          (item) => item.contentId === contentId
        );

        datesAvailability[docSnap.id.split("_")[1]] = matchedContent
          ? {
              siteS: matchedContent.siteS,
              siteM: matchedContent.siteM,
              siteL: matchedContent.siteL,
              siteC: matchedContent.siteC,
            }
          : { siteS: 0, siteM: 0, siteL: 0, siteC: 0 };
      });

      // 없는 날짜 초기화
      batchDates.forEach((date) => {
        if (!datesAvailability[date]) {
          datesAvailability[date] = {
            siteS: 0,
            siteM: 0,
            siteL: 0,
            siteC: 0,
          };
        }
      });
    }

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
      const minAvailable = getMinAvailableSites(siteCountsByDate);

      // DTsiteModal에 minAvailable 전달
      setMinAvailable(minAvailable);
    };

    fetchData();
  }, [startDate, endDate, campData]);

  // site 개수 보여주기 위한 함수
  const getSelectedSites = () => {
    if (siteCounts.every((count) => count === 0)) return;

    const siteNames = ["소", "중", "대", "카라반"];
    return siteCounts
      .map((count, index) =>
        count > 0 ? `${siteNames[index]} ${count}` : null
      )
      .filter(Boolean) // null 제거
      .join(" / ");
  };

  return (
    <section className="detail">
      {campData && (
        <>
          <div className="detail__overview">
            <div className="detail__overview-image-box">
              <img
                className="detail__overview-image"
                src={campData.firstImageUrl || noImage}
                alt="캠핑장 이미지"
              />
            </div>
            <div className="detail__overview-reserv">
              <h2 className="detail__overview-reserv--title">
                <span className="detail__overview-reserv--location">
                  {campData.doNm} {campData.sigunguNm}
                </span>
                {campData.facltNm}
              </h2>
              <p className="detail__overview-reserv--campstyle">
                {campData.induty}
              </p>
              {campData.themaEnvrnCl ? (
                <p className="detail__overview-reserv--subtitle">
                  {campData.themaEnvrnCl}
                </p>
              ) : (
                <></>
              )}

              <div className="detail__overview-reserv--option">
                <div className="btn-container">
                  <div className="btn-date">
                    <span className="btn-date-title">기간</span>
                    <SearchBarButton
                      className="searchbutton-site"
                      color="secondary"
                      iconPosition="left"
                      icon={<img src={calico} width={"20px"} height={"20px"} />}
                      onClick={() => handleOpenModal(dateModal)}
                    >
                      날짜 선택
                    </SearchBarButton>
                  </div>
                  {startDate && endDate ? (
                    <span className="btn-date-result">
                      {startDate} ~ {endDate}
                    </span>
                  ) : (
                    <></>
                  )}
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
                      icon={
                        <img src={siteico} width={"20px"} height={"20px"} />
                      }
                      onClick={() => handleOpenModal(siteModal)}
                    >
                      자리 선택
                    </SearchBarButton>
                  </div>
                  <span className="btn-date-result">{getSelectedSites()}</span>
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
                  siteSPrice={campData.siteMg1CoPrice}
                  siteMPrice={campData.siteMg2CoPrice}
                  siteLPrice={campData.siteMg3CoPrice}
                  siteCPrice={campData.caravSiteCoPrice}
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
                        onClick={() => {
                          mutation.mutate({
                            startDate,
                            endDate,
                            siteCounts,
                            totalPrice,
                          });
                          handleOpenModal(cartModal);
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
                        handleClose={() => handleCancelModal(cartModal)}
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
      )}

      <Topbtn />
    </section>
  );
};

export default DetailPage;
