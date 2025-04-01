import { create } from "zustand";

const useHeaderStore = create(() => ({
  // selectBox의 초기값
  selects: ["예약현황", "장바구니", "정보변경", "로그아웃"],
}));

export default useHeaderStore;
