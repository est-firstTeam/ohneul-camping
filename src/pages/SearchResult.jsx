import NoResult from "../components/NoResult";
import ProductList from "../components/ProductList";
import SearchBar from "../components/Searchbar";
import SelectBox from "../components/SelectBox";
import useSearchStore from "../store/useSearchStore";

const SearchResult = () => {
  const { searchResult } = useSearchStore();

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
      {/* <ProductSearchList campSiteData={searchResult} /> */}
      {/* <ProductList stock={true} campSiteData={searchResult} /> */}
    </div>
  );
};
export default SearchResult;
