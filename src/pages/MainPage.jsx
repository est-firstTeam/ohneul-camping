import TopBtn from "../components/Topbtn.jsx";
import Searchbar from "../components/Searchbar.jsx";
import MainIntro from "../components/MainIntro.jsx";
import MainRecommand from "../components/MainRecommand.jsx";
import MainMostRSV from "../components/MainMostRSV.jsx";
import MainAllCampsite from "../components/MainAllCampsite.jsx";

const Main = () => {
  return (
    <>
      <TopBtn />
      <MainIntro />
      <article className="searchbar-wrapper">
        <Searchbar />
      </article>
      <MainRecommand />
      <MainMostRSV />
      <MainAllCampsite />
    </>
  );
};
export default Main;
