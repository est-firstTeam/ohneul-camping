import TopBtn from "./../components/Topbtn";
import ButtonExam from "./ButtonExam";
import Searchbar from "../components/Searchbar.jsx";
import MainIntro from "../components/MainIntro.jsx";
import MainRecommand from "../components/MainRecommand.jsx";
import MainMostRSV from "../components/MainMostRSV.jsx";
import MainAllCampsite from "../components/MainAllCampsite.jsx";
import { useRef } from "react";
import useSectionRefStore from "../store/useSectionRefStore.js";
import { useEffect } from "react";

const Main = () => {
  const reservationRef = useRef(null);
  const searchRef = useRef(null);
  const { search, reservation, setRefs } = useSectionRefStore();

  useEffect(() => {
    // 처음 렌더링 시에 refs를 설정
    if (search.current === null || reservation.current === null) {
      // 스토어의 search,reservation이null이면 set
      setRefs(reservationRef, searchRef);
    }
  }, [setRefs]);

  return (
    <>
      <TopBtn />
      <MainIntro />
      <div className="searchbar-wrapper" ref={search}>
        <Searchbar />
      </div>
      <MainRecommand />
      <MainMostRSV />
      <MainAllCampsite />
    </>
  );
};
export default Main;
