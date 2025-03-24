import ProductList from "../components/ProductList";
import SearchBar from "../components/Searchbar";
import useSearchStore from "../store/useSearchStore";

const SearchResult = () => {
  const { searchResult } = useSearchStore();
  return (
    <>
      <SearchBar />
      <ProductList stock={true} campsiteData={searchResult} />
    </>
  );
};
export default SearchResult;
