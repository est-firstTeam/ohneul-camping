import { useState } from "react";
import Modal from "../components/Modal";
import SearchBar from "../components/Searchbar";

const SearchResult = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button onClick={() => setShowModal(true)}>모달</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>모달모달모달</Modal>
            )}
            <SearchBar />
        </>
    );
};
export default SearchResult;
