import { useEffect } from "react";
import TopBtn from "./../components/Topbtn";
import ButtonExam from "./ButtonExam";
import { fBService } from "../util/fbService";
import Searchbar from "../components/Searchbar.jsx";
import MainIntro from "../components/MainIntro.jsx";
import MainRecommand from "../components/MainRecommand.jsx";

const Main = () => {
  useEffect(() => {
    fBService.getAllReservation().then((result) => {
      console.log("%o", result);
    });
    fBService.getSearchCampSite().then((result) => {
      console.log("%o", result);
    });
  });

  return (
    <>
      <TopBtn />
      <MainIntro />
      <div className="searchbar-wrapper">
        <Searchbar />
      </div>
      <MainRecommand />
    </>
  );
};
export default Main;
