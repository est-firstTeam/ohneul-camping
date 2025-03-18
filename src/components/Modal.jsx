import Button from "./Button";

// modalRef에는 모달의 useRef를 사용해 dialog요소를 직접 제어할 수 있게 합니다.
// children에는 모달에 들어갈 내용을 직접 정의합니다.
const Modal = ({ modalRef, children }) => {
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
