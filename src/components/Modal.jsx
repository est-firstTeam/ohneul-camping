import Button from "./Button";

const Modal = ({ children, onClose }) => {
    return (
        <div className="modal__overlay">
            <div className="modal__content">
                {children}
                <Button
                    onClick={onClose}
                    color={"secondary"}
                    padding={"1rem 2rem"}
                >
                    닫기
                </Button>
            </div>
        </div>
    );
};

export default Modal;
