import { useRef } from "react";
import Modal from "../components/Modal";
import SearchBar from "../components/Searchbar";

const SearchResult = () => {
    const modalRef = useRef(null);

    // 모달 열기
    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    return (
        <>
            <button onClick={openModal}>모달</button>
            <Modal modalRef={modalRef}>모달모달모달</Modal>
            <SearchBar />
        </>
    );
};
export default SearchResult;
