// import useSearchStore from "../store/useSearchStore";

class Selectors {
  getUserCartItems = (users) => {
    const hasCartItems =
      users &&
      users[0] &&
      users[0].data &&
      users[0].data.carts &&
      users[0].data.carts.length > 0;

    return hasCartItems ? users[0].data.carts : [];
  };

  getSearchLocationStartDate = (siteArr, searchValue, filterValue) => {
    if (!siteArr[0] || siteArr[0].length === 0) {
      return [];
    }

    const filteredItems = siteArr[0].data.content.filter((item) => {
      if (searchValue === "소(1~3인)") {
        return item.siteS !== null;
      }
      if (searchValue === "중(4~6인)") {
        return item.siteM !== null;
      }
      if (searchValue === "대(7~10인)") {
        return item.siteL !== null;
      }
      if (searchValue === "카라반(1~4인)") {
        return item.siteC !== null;
      }
      return false;
    });

    // console.log("selector에서의", filterValue);

    // productList의 무한스크롤을 위한 useEffect때문에 실행안되었음
    // item.siteS를 기준으로 큰 순서대로 정렬
    // b-a가 양수면 a, b 위치 변경
    // 필터링된 결과를 정렬
    if (filterValue === "재고 많은 순") {
      if (searchValue === "소(1~3인)") {
        return filteredItems.sort((a, b) => b.siteS - a.siteS);
      }
      if (searchValue === "중(4~6인)") {
        return filteredItems.sort((a, b) => b.siteM - a.siteM);
      }
      if (searchValue === "대(7~10인)") {
        return filteredItems.sort((a, b) => b.siteL - a.siteL);
      }
      if (searchValue === "카라반(1~4인)") {
        return filteredItems.sort((a, b) => b.siteC - a.siteC);
      }
    } else if (filterValue === "야영장 가나다 순") {
      return filteredItems.sort((a, b) =>
        a.facltNm.localeCompare(b.facltNm, "ko")
      );
    } else if (filterValue === "지역 가나다 순") {
      return filteredItems.sort((a, b) =>
        a.sigunguNm.localeCompare(b.sigunguNm, "ko")
      );
    }
  };
}
export const selectors = new Selectors();
