import { useEffect, useRef, useState } from "react";
import myPageTitleStore from "../store/mypageTitleStore";
import { useQuery } from "@tanstack/react-query";
import { fBService } from "../util/fbService";
import { monthDateFormat, getDaysBetweenDates } from "../util/util";
import { reservationService } from "../util/reservationService";
import ProductListCart from "../components/ProductListCart";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";

const Reservation = ({ userId = "KvsuGtPyBORD2OHATEwpvthlQKt1" }) => {
  const { setTitle } = myPageTitleStore();

  // 모달
  // const { cancelReservation } = useReservation();
  const modalRef = useRef(null);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  // 취소 하시겠습니까? > '확인' 클릭 시 '취소 완료' 모달로 변경
  const [modalStep, setModalStep] = useState("confirm");

  // Reservation/userId: 예약 정보 조회에 사용
  const { data: reservationData, refetch } = useQuery({
    queryKey: [`/reservation/${userId}`],
    queryFn: () => fBService.getAllReservation(userId),
  });

  // User/name: 레이아웃 상단에 이름 출력 시 사용
  const { data: userName } = useQuery({
    queryKey: [`/user/name/${userId}`],
    queryFn: () => fBService.getUserNameById(userId),
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
      } catch (error) {
        console.error("예약 취소 오류:", error);
      }
    }
  };

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
              <Link to={`/searchResult/${reservation.data.campSiteId}`}>
                <ProductListCart
                  key={reservation.id}
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
                  // onCancelClick={() => handleCancelClick(reservation.id)}
                  onCancelClick={(event) => {
                    event.stopPropagation(); // 버튼 클릭 시 Link로 넘어가지 않게 방지
                    event.preventDefault(); // Link 이동 막기
                    handleCancelClick(reservation.id);
                  }}
                />
              </Link>
            );
          })
        ) : (
          <div>예약 내역이 없습니다.</div>
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
          buttonType="button"
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
                {/* <form method="dialog" className="btn__container">
                  <Button
                    color={"secondary"}
                    padding={"1rem 2rem"}
                    type={"button"}
                    onClick={handleCancel}
                  >
                    취소
                  </Button>
                  <Button
                    color={"primary"}
                    padding={"1rem 2rem"}
                    size={"medium"}
                    type={"button"}
                    onClick={handleConfirmModal}
                  >
                    확인
                  </Button>
                </form> */}
              </>
            ) : (
              <>
                <h2 className="modal__title">예약이 취소되었습니다.</h2>
                <div className="modal__content">
                  예약 현황 목록에서 확인하실 수 있습니다.
                </div>
                {/* <form method="dialog" className="btn__container">
                  <Button
                    color={"primary"}
                    padding={"1rem 2rem"}
                    size={"medium"}
                    type={"button"}
                    onClick={handleCancel}
                  >
                    확인
                  </Button>
                </form> */}
              </>
            )}
          </div>
        </Modal>
      </div>
    </section>
  );
};
export default Reservation;
