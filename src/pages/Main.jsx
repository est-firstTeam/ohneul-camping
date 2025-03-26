import TopBtn from "./../components/Topbtn";
import ButtonExam from "./ButtonExam";
import Searchbar from "../components/Searchbar.jsx";
import MainIntro from "../components/MainIntro.jsx";
import MainRecommand from "../components/MainRecommand.jsx";
import MainMostRSV from "../components/MainMostRSV.jsx";
import MainAllCampsite from "../components/MainAllCampsite.jsx";
import Test from "../components/Test.jsx";

const Main = () => {
  return (
    <>
      <TopBtn />
      <MainIntro />
      <div className="searchbar-wrapper">
        <Searchbar />
      </div>
      <MainRecommand />
      <MainMostRSV />
      {/* <Test /> */}
      <MainAllCampsite />
    </>
  );
};
export default Main;
