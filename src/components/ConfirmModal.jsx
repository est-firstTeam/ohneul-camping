import React from "react";
import Modal from "./Modal";
import addCart from "../images/ico-checkCart.svg";
import Button from "./Button";
import { Link } from "react-router-dom";

const ConfirmModal = ({ modalRef, handleClose }) => {
  return (
    <Modal
      modalRef={modalRef}
      handleCancel={handleClose}
      text="확인"
      // cancelBtn={true}
      // confirmBtn={true}
    >
      <div className="confirm__modal">
        <div className="confirm__modal-imgContainer">
          <img className="confirm__modal-icon" src={addCart} />
        </div>
        <span className="confirm__modal-info">장바구니에 추가되었습니다.</span>
      </div>
      <div className="confirm__modal-buttonContainer">
        <Button color="secondary" onClick={handleClose} margin={"0 0 0 2rem"}>
          계속 쇼핑하기
        </Button>
        {/* <Link to={"/my/cart"}> */}
        <Button>장바구니 보기</Button>
        {/* </Link> */}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
