import { useEffect, useRef, useState } from "react";
import myPageTitleStore from "../store/mypageTitleStore";
import { useUserStore } from "../store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import { fBService } from "../util/fbService";
import { firebaseDB } from "../firebaseConfig";
import { monthDateFormat, getDaysBetweenDates } from "../util/util";
import { reservationService } from "../util/reservationService";
import ProductListCart from "../components/ProductListCart";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
} from "firebase/firestore";
import { getDatesInRange } from "../util/util";

const Reservation = () => {
  const userId = useUserStore((state) => state.id);
  const { setTitle } = myPageTitleStore();

  // 모달
  const modalRef = useRef(null);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  // 취소 하시겠습니까? > '확인' 클릭 시 '취소 완료' 모달로 변경
  const [modalStep, setModalStep] = useState("confirm");

  // User/name: 레이아웃 상단에 이름 출력 시 사용
  const { data: userName } = useQuery({
    queryKey: [`/user/name/${userId}`],
    queryFn: () => fBService.getUserNameById(userId),
    enabled: !!userId, // userId가 존재할 때만 실행
  });

  // Reservation/userId: 예약 정보 조회에 사용
  const { data: reservationData, refetch } = useQuery({
    queryKey: [`/reservation/${userId}`],
    queryFn: () => fBService.getAllReservation(userId),
    enabled: !!userId, // userId가 존재할 때만 실행
  });

  useEffect(() => {
    if (userName) {
      setTitle(`${userName} 님, 반가워요!`);
    }
  }, [userName, setTitle]);

  // 예약 취소 확인용 모달
  const handleCancelClick = (reservationId) => {
    setSelectedReservationId(reservationId);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };
  // 모달 취소 버튼 클릭 : 창 닫기
  const handleCancel = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
    setSelectedReservationId(null);
    setModalStep("confirm"); // 초기화
  };

  // 모달 확인 버튼 클릭 : 예약 취소 + 'rsvComplete -1'
  const handleConfirmModal = async () => {
    if (selectedReservationId) {
      const reservation = reservationData.find(
        (r) => r.id === selectedReservationId
      );
      if (!reservation) return;

      try {
        // 예약 취소
        await reservationService.cancelReservation(selectedReservationId);

        // 캠핑장 예약 수 감소 (Reservation : campSiteId 가져옴)
        const campSiteId = reservation.data?.campSiteId;
        if (campSiteId) {
          await reservationService.decrementRsvComplete(campSiteId);
        }

        // 새로고침 없이 상태 즉시 반영
        refetch();
        setModalStep("completed");
      } catch (error) {
        console.error("예약 취소 오류:", error);
      }
    }
  };

  // 중복 업데이트 방지
  const previousUpdateRef = useRef(null);

  useEffect(() => {
    if (modalStep === "completed" && selectedReservationId) {
      const reservation = reservationData.find(
        (r) => r.id === selectedReservationId
      );

      if (reservation) {
        const campSiteId = reservation.data?.campSiteId;
        const rsvSiteS = reservation.data?.rsvSiteS || 0;
        const rsvSiteM = reservation.data?.rsvSiteM || 0;
        const rsvSiteL = reservation.data?.rsvSiteL || 0;
        const rsvSiteC = reservation.data?.rsvSiteC || 0;

        // 중복 업데이트 방지: 이전과 같은 업데이트 요청인지 확인
        const updateKey = `${selectedReservationId}-${modalStep}-${campSiteId}`;
        if (previousUpdateRef.current === updateKey) {
          console.log("중복 실행 방지: 이미 처리된 업데이트");
          return;
        }
        previousUpdateRef.current = updateKey;

        // 캠핑장 정보 조회
        const fetchCampsiteData = async () => {
          const campsiteQuery = query(
            collection(firebaseDB, "Campsite"),
            where("contentId", "==", String(campSiteId))
          );
          const campsiteSnapshot = await getDocs(campsiteQuery);

          // doNm_날짜 조회를 위한 세팅
          if (!campsiteSnapshot.empty) {
            const campsiteData = campsiteSnapshot.docs[0].data();
            const doNm = campsiteData.doNm;
            const rsvStartDate = reservation.data.rsvStartDate;
            const rsvEndDate = reservation.data.rsvEndDate;

            // 기간에 해당하는 날짜 구하기
            const datesInRange = getDatesInRange(rsvStartDate, rsvEndDate);

            // Available_RSV 문서 조회
            const updateAvailableRsvData = async () => {
              for (const date of datesInRange) {
                const docId = `${doNm}_${date}`;
                const docRef = doc(firebaseDB, "Available_RSV", docId);

                try {
                  // 예약 취소 재고 복구
                  await runTransaction(firebaseDB, async (transaction) => {
                    const docSnap = await transaction.get(docRef);
                    if (!docSnap.exists()) return;

                    const availableData = docSnap.data();
                    const contentArray = availableData.content || [];

                    // site와 rsvSite 매칭해서 연산
                    const updatedContentArray = contentArray.map((item) => {
                      if (String(item.contentId) === String(campSiteId)) {
                        let { siteS, siteM, siteL, siteC } = item;

                        // null 은 연산하지 않음
                        siteS = siteS !== null ? siteS + (rsvSiteS || 0) : null;
                        siteM = siteM !== null ? siteM + (rsvSiteM || 0) : null;
                        siteL = siteL !== null ? siteL + (rsvSiteL || 0) : null;
                        siteC = siteC !== null ? siteC + (rsvSiteC || 0) : null;

                        return { ...item, siteS, siteM, siteL, siteC };
                      }
                      return item;
                    });

                    transaction.update(docRef, {
                      content: updatedContentArray,
                    });
                  });

                  console.log(`DB 업데이트 완료: ${docId}`);
                } catch (error) {
                  console.error(`DB 업데이트 실패: ${error}`);
                }
              }
            };
            // DB 업데이트
            updateAvailableRsvData();
          }
        };
        // 데이터 조회
        fetchCampsiteData();
      }
    }
  }, [modalStep, selectedReservationId, reservationData]);

  return (
    <section className="reservation">
      <h2 className="reservation__title ">예약 확인 페이지 입니다.</h2>
      <div className="product-list">
        {reservationData?.length > 0 ? (
          reservationData.map((reservation) => {
            const isCanceled = reservation.data?.rsvIsCanceled === true;
            const isPastDate =
              new Date(reservation.data?.rsvStartDate) <= new Date();
            const isDisabled = isCanceled || isPastDate;
            const buttonText = isCanceled
              ? "취소 완료"
              : isPastDate
              ? "취소 불가"
              : "예약 취소";

            return (
              <Link
                key={reservation.id}
                to={`/searchResult/${reservation.data.campSiteId}`}
              >
                <ProductListCart
                  firstImageUrl={reservation.data.firstImageUrl}
                  startDate={monthDateFormat(reservation.data.rsvStartDate)}
                  endDate={monthDateFormat(reservation.data.rsvEndDate)}
                  day={getDaysBetweenDates(
                    reservation.data.rsvStartDate,
                    reservation.data.rsvEndDate
                  )}
                  facltNm={reservation.data.facltNm}
                  selected1={reservation.data.rsvSiteS}
                  selected2={reservation.data.rsvSiteM}
                  selected3={reservation.data.rsvSiteL}
                  selected4={reservation.data.rsvSiteC}
                  sumPrice={reservation.data.rsvTotalPrice}
                  isRSV
                  isDisabled={isDisabled}
                  buttonText={buttonText}
                  onCancelClick={(event) => {
                    event.stopPropagation(); // 버튼 클릭 시 Link 이벤트 전파 방지
                    event.preventDefault(); // Link 이동 막기
                    handleCancelClick(reservation.id);
                  }}
                />
              </Link>
            );
          })
        ) : (
          <div className="reservation__no-item">예약 내역이 없습니다.</div>
        )}
        {/* 예약 취소 모달*/}
        <Modal
          modalRef={modalRef}
          handleCancel={handleCancel}
          handleConfirm={
            modalStep === "confirm" ? handleConfirmModal : handleCancel
          }
          text={"확인"}
          cancelBtn={modalStep === "confirm"}
          confirmBtn={true}
          buttonType={"button"}
        >
          <div className="modal__rsvcancel">
            {modalStep === "confirm" ? (
              <>
                <h2 className="modal__title">예약을 취소하시겠습니까?</h2>
                <div className="modal__content">
                  예약을 취소하시면 되돌릴 수 없습니다.
                  <br />
                  예약 취소를 원하실 경우 '확인' 버튼을 클릭해 주세요.
                </div>
              </>
            ) : (
              <>
                <h2 className="modal__title">예약이 취소되었습니다.</h2>
                <div className="modal__content">
                  예약 현황 목록에서 확인하실 수 있습니다.
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </section>
  );
};
export default Reservation;
