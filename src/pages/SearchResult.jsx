import { useQuery } from "@tanstack/react-query";
import NoResult from "../components/NoResult";
import ProductList from "../components/ProductList";
import SearchBar from "../components/Searchbar";
import SelectBox from "../components/SelectBox";
import useSearchStore from "../store/useSearchStore";
import { fBService } from "../util/fbService";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { selectors } from "../util/selectors";
import TopBtn from "../components/Topbtn";

const SearchResult = () => {
  const {
    filterValue,
    setLocation,
    setStartDate,
    setEndDate,
    setSite,
    searchResult,
    setSearchResult,
  } = useSearchStore();

  const { location, startdate, enddate, site } = useParams();

  console.log("filterValue", filterValue);
  // 검색 쿼리
  const { data: searchData } = useQuery({
    queryKey: ["search", location, startdate, site], // querykey에 변경값을 작성해야 변경이 된다
    queryFn: () => {
      console.log("SearchData  QueryFn!!!");
      if (location === "전체") {
        return fBService.getSearchAllARSV(startdate);
      }
      return fBService.getSearchARSV(location, startdate);
    },
    select: (data) =>
      selectors.getSearchLocationStartDate(data, site, filterValue), // useParams의 site로 지정해서 select를 하면 params부분만 필터(기존에는 searchValue.site로 지정해서 사이트 변경시 자동으로 필터링 되었음)
  });

  // URL 파라미터가 변경 --> 검색바의 값을 유지하기 위해 사용
  useEffect(() => {
    setLocation(location);
    setStartDate(startdate);
    setEndDate(enddate);
    setSite(site);
  }, [
    location,
    startdate,
    enddate,
    site,
    setLocation,
    setStartDate,
    setEndDate,
    setSite,
  ]);

  // 검색 결과가 변경
  useEffect(() => {
    if (searchData) {
      setSearchResult(searchData);
    }
  }, [searchData, setSearchResult]);

  console.log(searchData);

  return (
    <section className="wrapper-search">
      <h2 className="section-title">검색 결과 페이지</h2>
      <SearchBar />
      <div className="search-header">
        <h2 className="header-count">검색 결과 {searchResult.length}건</h2>
        <div className="header-select">
          <h2 className="header-count">정렬기준:</h2>
          <SelectBox />
        </div>
      </div>
      {searchResult.length !== 0 ? (
        <ProductList campSiteData={searchResult} />
      ) : (
        <NoResult text={"검색 결과가 없습니다."} />
      )}
      <TopBtn />
    </section>
  );
};

export default SearchResult;
