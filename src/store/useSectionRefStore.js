import { create } from "zustand";
// 헤더의 메뉴클릭시 해당 위치로 스크롤 하기 위한 ref전역 저장

const useSectionRefStore = create(() => ({
  search: { current: null },
}));

export default useSectionRefStore;
