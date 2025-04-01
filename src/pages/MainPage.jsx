import TopBtn from "../components/Topbtn.jsx";
import ButtonExam from "./ButtonExam.jsx";
import Searchbar from "../components/Searchbar.jsx";
import MainIntro from "../components/MainIntro.jsx";
import MainRecommand from "../components/MainRecommand.jsx";
import MainMostRSV from "../components/MainMostRSV.jsx";
import MainAllCampsite from "../components/MainAllCampsite.jsx";
import useSectionRefStore from "../store/useSectionRefStore.js";

const Main = () => {
  const { search } = useSectionRefStore();

  return (
    <>
      <TopBtn />
      <MainIntro />
      <article className="searchbar-wrapper" ref={search}>
        <Searchbar />
      </article>
      <MainRecommand />
      <MainMostRSV />
      <MainAllCampsite />
    </>
  );
};
export default Main;
