import { create } from "zustand";

const useSearchStore = create((set) => ({
  // 위치 모달 초기값
  locations: [
    { kor: "전체", eng: "all" },
    { kor: "서울시", eng: "seoul" },
    { kor: "인천시", eng: "incheon" },
    { kor: "경기도", eng: "gyeonggi" },
    { kor: "강원도", eng: "gangwon" },
    { kor: "대전시", eng: "daejeon" },
    { kor: "세종시", eng: "seojong" },
    { kor: "대구시", eng: "daegu" },
    { kor: "부산시", eng: "busan" },
    { kor: "울산시", eng: "ulsan" },
    { kor: "전주시", eng: "jeonju" },
    { kor: "광주시", eng: "gwangju" },
    { kor: "충청남도", eng: "chungcheongnamdo" },
    { kor: "충청북도", eng: "chungcheongbugdo" },
    { kor: "전라남도", eng: "jeonlanamdo" },
    { kor: "전라북도", eng: "jeonlabugdo" },
    { kor: "경상남도", eng: "gyeongsangnamdo" },
    { kor: "경상북도", eng: "gyeongsangbugdo" },
    { kor: "제주도", eng: "jejudo" },
  ],

  // 사이트 모달 초기값
  sites: [
    { kor: "소(1~3인)", eng: "small" },
    { kor: "중(4~6인)", eng: "medieum" },
    { kor: "대(7~10인)", eng: "large" },
    { kor: "카라반(1~4인)", eng: "car" },
  ],

  // 검색 결과 초기값`
  searchValue: {
    location: null,
    site: null,
    startDate: null,
    endDate: null,
  },

  // 검색 결과
  searchResult: [],

  // selectBox 초기값
  filterValue: "재고 많은 순",

  //selectBox 값 Array
  optionArr: ["재고 많은 순", "야영장 가나다 순", "지역 가나다 순"],

  // selectBox 값 변경
  setFilterValue: (newValue) => {
    set((state) => ({
      ...state,
      filterValue: newValue,
    }));
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

  // 검색
  setSearchResult: (data) => {
    set(() => ({
      searchResult: data,
    }));
  },
}));

export default useSearchStore;
