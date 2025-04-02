import Button from "./Button";
import ModalPortal from "./ModalPortal";
// modalRef에는 모달의 useRef를 사용해 dialog요소를 직접 제어할 수 있게 합니다.
// children에는 모달에 들어갈 내용을 직접 정의합니다.

const Modal = ({
  modalRef,
  children,
  handleCancel = () => {},
  handleConfirm = () => {},
  text,
  cancelBtn,
  confirmBtn,
  buttonType = "submit",
}) => {
  return (
    <ModalPortal>
      <dialog ref={modalRef} className="modal__overlay">
        <div className="modal__content">
          {children}
          <form method="dialog" className="btn__container">
            {cancelBtn && (
              <Button
                color={"secondary"}
                padding={"1rem 2rem"}
                type={"submit"}
                onClick={handleCancel}
              >
                취소
              </Button>
            )}
            {confirmBtn && (
              <Button
                color={"primary"}
                padding={"1rem 2rem"}
                size={"medium"}
                type={buttonType}
                onClick={handleConfirm}
              >
                {text}
              </Button>
            )}
          </form>
        </div>
      </dialog>
    </ModalPortal>
  );
};

export default Modal;
