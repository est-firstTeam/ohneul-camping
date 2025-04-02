// 모달 여는함수
export const handleOpenModal = (currentModal) => {
  if (currentModal.current) {
    currentModal.current.showModal();
  }
};

// 모달 취소 버튼 클릭 : 창 닫기
export const handleCancelModal = (currentModal) => {
  if (currentModal.current) {
    currentModal.current.close();
  }
};
