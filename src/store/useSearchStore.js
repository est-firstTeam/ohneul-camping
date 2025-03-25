import { create } from "zustand";

const useSearchStore = create((set) => ({
  // 위치 모달 초기값
  locations: [
    "전체",
    "서울시",
    "인천시",
    "경기도",
    "강원도",
    "대전시",
    "세종시",
    "대구시",
    "부산시",
    "울산시",
    "전주시",
    "광주시",
    "충청남도",
    "충청북도",
    "전라남도",
    "전라북도",
    "경상남도",
    "경상북도",
    "제주도",
  ],

  // 사이트 모달 초기값
  sites: ["소(1~3인)", "중(4~6인)", "대(7~10인)", "카라반(1~4인)"],

  // 검색 결과 초기값
  searchValue: {
    location: null,
    site: null,
    startDate: null,
    endDate: null,
  },

  // 취소
  setCancel: (key) => {
    set((state) => ({
      searchValue: {
        ...state.searchValue,
        [key]: null,
      },
    }));
  },

  // 위치 선택
  setLocation: (location) => {
    set((state) => ({
      searchValue: {
        ...state.searchValue,
        location,
      },
    }));
  },

  // 시작날 & 마지막날 선택
  setStartDate: (startDate) => {
    set((state) => ({
      searchValue: {
        ...state.searchValue,
        startDate,
      },
    }));
  },

  setEndDate: (endDate) => {
    set((state) => ({
      searchValue: {
        ...state.searchValue,
        endDate,
      },
    }));
  },

  // 사이트 선택
  setSite: (site) => {
    set((state) => ({
      searchValue: {
        ...state.searchValue,
        site,
      },
    }));
  },
}));

export default useSearchStore;
