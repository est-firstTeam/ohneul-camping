const Modal = ({ children, onClose }) => {
    return (
        <div className="modal__overlay">
            <div className="modal__content">
                {children}
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default Modal;
