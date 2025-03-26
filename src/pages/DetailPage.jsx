import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import calico from "../images/ico-calendar.svg";
import siteico from "../images/ico-vector.svg";
import addCart from "../images/ico-addCart.svg";
import Topbtn from "../components/Topbtn";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseDB } from "../firebaseConfig";
import DateModal from "../components/DateModal";
import { useParams } from "react-router-dom";
import DTsiteModal from "../components/DTsiteModal";
import useSiteStore from "../store/useSiteStore";
import DetailOptionBox from "../components/DetailOptionBox";
import { firebaseAPI } from "../util/firebaseApi";
import DetailInfo from "../components/DetailInfo";
import DetailFacility from "../components/DetailFacility";

const DetailPage = () => {
  const { id } = useParams();
  const [campData, setCampData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const dateModal = useRef(null);
  const siteModal = useRef(null);
  const { siteCounts } = useSiteStore();

  useEffect(() => {
    const fetchCampData = async () => {
      try {
        // contentId로 캠핑장 데이터 가져오기
        const allDocs = await firebaseAPI.getAllDocs("Available_RSV");

        let foundContent = null;
        for (const doc of allDocs) {
          const contentArray = doc.data.content || [];

          const matchedContent = contentArray.find(
            (item) => item.contentId === id
          );

          if (matchedContent) {
            foundContent = matchedContent;
            break;
          }
        }

        if (foundContent) {
          setCampData(foundContent);
        } else {
          console.log("해당 contentId에 대한 데이터 없음");
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchCampData();
  }, [id]);

  console.log(campData);

  // 날짜 선택 모달 열기
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

  const updateUserCart = async (startDate, endDate, siteCounts, totalPrice) => {
    const userId = "6oh1GaHoK0ggGiv9kiHqxiIPipz1"; // 고정된 문서 ID(추후 user에 따라 변경)
    const userRef = doc(firebaseDB, "User", userId);

    try {
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const carts = userData.carts || [];

        const newCartItem = {
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
        };

        carts.push(newCartItem);

        await updateDoc(userRef, { carts });

        console.log("장바구니에 항목 추가 성공");
      }
    } catch (error) {
      console.error("오류 발생", error);
    }
  };
  // ~박 계산 로직
  const calculateNights = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const timeDiff = endDateObj - startDateObj;
    const nightCount = timeDiff / (1000 * 60 * 60 * 24);
    return nightCount;
  };
  const nightCount = calculateNights(startDate, endDate);

  const totalPrice = siteCounts.reduce((sum, count, index) => {
    let pricePerSite = 0;
    if (index === 0) {
      pricePerSite = campData?.siteSPrice || 0; // 소
    } else if (index === 1) {
      pricePerSite = campData?.siteMPrice || 0; // 중
    } else if (index === 2) {
      pricePerSite = campData?.siteLPrice || 0; // 대
    } else if (index === 3) {
      pricePerSite = campData?.siteCPrice || 0; // 카라반
    }

    return sum + count * pricePerSite * nightCount;
  }, 0);

  // console.log("totalPrice:", totalPrice);
  // console.log("start date: ", startDate); // 2025-04-02
  // console.log("end date:", endDate); // 2025-04-05

  // const fetchSiteCountsForEachDate = async (location, startDate, endDate) => {
  //   // startDate와 endDate 사이의 날짜 목록 생성
  //   console.log("start date2:", startDate);
  //   console.log("end date:", endDate);
  //   const getDatesInRange = (start, end) => {
  //     const dateArray = [];
  //     let currentDate = new Date(start);
  //     const endDateObj = new Date(end);

  //     while (currentDate <= endDateObj) {
  //       dateArray.push(
  //         currentDate
  //           .toLocaleDateString("ko-KR", {
  //             year: "numeric",
  //             month: "2-digit",
  //             day: "2-digit",
  //           })
  //           .replace(/\. /g, "-")
  //           .replace(".", "")
  //       );
  //       currentDate.setDate(currentDate.getDate() + 1);
  //     }
  //     return dateArray;
  //   };

  //   const dateList = getDatesInRange(startDate, endDate);
  //   console.log("데이트리스트", dateList);
  //   let datesAvailability = {};

  //   for (const date of dateList) {
  //     const docId = `${location}_${date}`;
  //     const docRef = doc(firebaseDB, "Available_RSV", docId);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       const data = docSnap.data();
  //       datesAvailability[date] = {
  //         siteS: data?.siteS || 0,
  //         siteM: data?.siteM || 0,
  //         siteL: data?.siteL || 0,
  //         siteC: data?.siteC || 0,
  //       };
  //       console.log("문서 데이터:", data);
  //       console.log(
  //         `siteS: ${data?.siteS}, siteM: ${data?.siteM}, siteL: ${data?.siteL}, siteC: ${data?.siteC}`
  //       );
  //     } else {
  //       console.log(`문서 없음: ${docId}`);
  //       console.log(`조회할 문서 ID: ${docId}`);
  //       datesAvailability[date] = { siteS: 0, siteM: 0, siteL: 0, siteC: 0 }; // 문서 없을 경우 0으로 설정
  //     }
  //   }

  //   return datesAvailability;
  // };

  // useEffect(() => {
  //   if (!campData || !startDate || !endDate) return;

  //   const fetchData = async () => {
  //     const location = campData?.doNm;
  //     const siteCountsByDate = await fetchSiteCountsForEachDate(
  //       location,
  //       startDate,
  //       endDate
  //     );
  //     console.log("날짜별 사이트 개수:", siteCountsByDate);
  //   };

  //   fetchData();
  // }, [campData, startDate, endDate]);

  return (
    <section className="detail">
      <div>
        {campData ? (
          <div>
            <div className="detail__overview">
              <img
                className="detail__overview-image"
                src={campData.firstImageUrl}
                alt="캠핑장 사진"
              />
              <div className="detail__overview-reserv">
                <h4 className="detail__overview-reserv--location">
                  {campData.doNm} {campData.sigunguNm}
                </h4>
                <h3 className="detail__overview-reserv--subtitle">
                  {campData.themaEnvrnCl}
                </h3>
                <h2 className="detail__overview-reserv--title">
                  {campData.facltNm}
                </h2>
                <h4 className="detail__overview-reserv--campstyle">
                  {campData.induty}
                </h4>
                <div className="detail__overview-reserv--option">
                  <h4 className="detail__overview-reserv--option-text">옵션</h4>
                  <Button
                    className="btn-searchbar"
                    color="secondary"
                    iconPosition="left"
                    padding={"1rem 15rem 1rem 1rem"}
                    icon={<img src={calico} width={"20px"} height={"20px"} />}
                    onClick={openDateModal}
                  >
                    날짜 선택
                  </Button>
                  <DateModal
                    modalRef={dateModal}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                  />
                  <Button
                    className={"btn-searchbar"}
                    color={"secondary"}
                    iconPosition="left"
                    margin={"1rem 0"}
                    padding={"1rem 15rem 1rem 1rem"}
                    icon={<img src={siteico} width={"20px"} height={"20px"} />}
                    onClick={openSiteModal}
                  >
                    자리 선택
                  </Button>
                  <DTsiteModal modalRef={siteModal} />
                  <DetailOptionBox
                    startDate={startDate}
                    endDate={endDate}
                    siteCounts={siteCounts}
                    nightCount={nightCount}
                    campData={campData}
                  />
                  <div className="row-line"></div>
                  <div className="detail__overview-reserv--payment">
                    <p className="detail__overview-reserv--payment-text">
                      총 상품 금액
                    </p>
                    <p className="detail__overview-reserv--payment-value">
                      {totalPrice.toLocaleString()} 원
                    </p>
                    <Button
                      className="detail__overview-reserv--addCartBtn"
                      icon={<img src={addCart} />}
                      padding={"0.6rem 5rem"}
                      iconPosition="right"
                      onClick={() =>
                        updateUserCart(
                          startDate,
                          endDate,
                          siteCounts,
                          totalPrice,
                          nightCount
                        )
                      }
                    >
                      장바구니 담기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="detail__add-on">
              <DetailFacility campData={campData} />
              <div className="col-line"></div>
              <DetailInfo campData={campData} />
            </div>
          </div>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>

      <Topbtn />
    </section>
  );
};

export default DetailPage;
