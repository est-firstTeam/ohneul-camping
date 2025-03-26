import { useQuery } from "@tanstack/react-query";
import NoResult from "../components/NoResult";
import ProductList from "../components/ProductList";
import SearchBar from "../components/Searchbar";
import SelectBox from "../components/SelectBox";
import useSearchStore from "../store/useSearchStore";
import { fBService } from "../util/fbService";
import { selectors } from "../util/selectors";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SearchResult = () => {
  const navigate = useNavigate();
  const { location, startdate, enddate, site } = useParams();
  const {
    setLocation,
    setStartDate,
    setEndDate,
    setSite,
    searchResult,
    searchValue,
    setSearchResult,
  } = useSearchStore();

  const { data: siteArr, refetch } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: () => {
      if (searchValue.location === "전체") {
        return fBService.getSearchAllARSV(searchValue.startDate);
      } else if (searchValue.location !== "전체") {
        return fBService.getSearchARSV(
          searchValue.location,
          searchValue.startDate
        );
      }
    },
    select: (data) => selectors.getSearchLocationStartDate(data, searchValue),
  });

  console.log(siteArr);

  useEffect(() => {
    const handleSearch = async () => {
      setLocation(location);
      setStartDate(startdate);
      setEndDate(enddate);
      setSite(site);
      const result = await refetch(); // refetch로 데이터 강제로 재요청
      setSearchResult(result.data || []);
      navigate(`/searchResult/${location}/${startdate}/${enddate}/${site}`);
    };
    handleSearch();
  }, [
    location,
    startdate,
    enddate,
    site,
    setLocation,
    setStartDate,
    setEndDate,
    setSite,
    refetch,
    setSearchResult,
    searchResult,
    navigate,
  ]);

  return (
    <div className="wrapper-search">
      <SearchBar />
      <div className="search-header">
        <h2 className="header-count">검색 결과 {searchResult.length}건</h2>
        <div className="header-select">
          <h2 className="header-count">정렬기준:</h2>
          <SelectBox />
        </div>
      </div>
      {searchResult.length !== 0 ? (
        <>
          <ProductList campSiteData={searchResult} />
        </>
      ) : (
        <>
          <NoResult text={"검색 결과가 없습니다."} />
        </>
      )}
    </div>
  );
};
export default SearchResult;
