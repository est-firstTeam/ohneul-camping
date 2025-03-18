// import Button from "./Button";

import Button from "./Button";

const Modal = ({ children, modalRef }) => {
    return (
        <dialog ref={modalRef} className="modal__overlay">
            <div className="modal__content">
                {children}
                <form method="dialog" className="btn__container">
                    <Button
                        color={"secondary"}
                        padding={"1rem 2rem"}
                        type={"submit"}
                    >
                        취소
                    </Button>
                    <Button
                        color={"primary"}
                        padding={"1rem 2rem"}
                        size={"medium"}
                        type={"submit"}
                    >
                        완료
                    </Button>
                </form>
            </div>
        </dialog>
    );
};

export default Modal;

// .show() 팝업열기.
// .showModal() 팝업열기 dimmed(검은색 배경).
// .close() 팝업닫기
