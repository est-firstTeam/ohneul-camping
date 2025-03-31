import Modal from "../components/Modal";
const RefundModal = (props) => {
  const modalRef = props.modalRef;
  /* 이용약관 환불규정 모달 */

  return (
    <Modal
      modalRef={modalRef}
      completeText="동의합니다"
      text={"완료"}
      confirmBtn
    >
      <div className="cart__modal">
        <span className="cart__modal-title">이용 약관 및 환불규정</span>
        <span className="cart__modal-content-title">내용</span>
        <ul className="cart__modal-list">
          <li>
            결제 예정 금액은 예약시 결제되는것이 아닌, 현장결제를 통해 지불하실
            금액입니다.
          </li>
          <li>
            본 사이트를 통해 예약한 캠핑장은 예약자 본인만 이용할 수 있습니다.
          </li>
          <li>
            예약자는 캠핑장 이용 수칙을 준수해야 하며, 시설 훼손 시 배상 책임이
            있습니다.
          </li>
          <li>현장 규정을 위반할 경우 이용이 제한될 수 있습니다.</li>
        </ul>
        <span className="cart__modal-content-title">환불 규정</span>
        <ul className="cart__modal-list">
          <li>이용일 2일 전까지 취소 시 100% 환불</li>
          <li>이용일 1일 전부터는 환불 불가</li>
          <li>
            천재지변 등 불가피한 사유로 캠핑장이 운영되지 않을 경우 전액
            환불됩니다.
          </li>
        </ul>
      </div>
    </Modal>
  );
};
export default RefundModal;
