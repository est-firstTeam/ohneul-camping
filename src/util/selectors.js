class Selectors {
  getSearchLocationStartDate = (siteArr, searchValue) => {
    if (!siteArr[0] || siteArr[0].length === 0) {
      return [];
    }
    return siteArr[0].data.content.filter((item) => {
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
  };
}
export const selectors = new Selectors();
