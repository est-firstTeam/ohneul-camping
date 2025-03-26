import { create } from "zustand";
import { persist } from "zustand/middleware";
// 헤더의 메뉴클릭시 해당 위치로 스크롤 하기 위한 ref전역 저장
const useSectionRefStore = create(
  persist(
    (set) => ({
      reservation: { current: null },
      search: { current: null },
      setRefs: (reservationRef, searchRef) =>
        set({
          reservation: reservationRef,
          search: searchRef,
        }),
    }),
    {
      name: "scroll-to",
    }
  )
);

export default useSectionRefStore;
