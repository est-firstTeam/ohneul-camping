import Button from "./Button";

const Modal = ({ children }) => {
  return (
    <dialog className="modal__overlay">
      <div className="modal__content">
        {children}
        <form method="dialog">
          {/* onClick Event 필요없음. 자동닫기 Ok */}
          <Button color={"secondary"} padding={"1rem 2rem"}></Button>
        </form>
      </div>
    </dialog>
  );
};

export default Modal;

// .show() 팝업열기.
// .showModal() 팝업열기 dimmed(검은색 배경).
// .close() 팝업닫기
