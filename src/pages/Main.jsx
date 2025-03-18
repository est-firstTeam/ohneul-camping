import { useEffect } from "react";
import TopBtn from "./../components/Topbtn";
import ButtonExam from "./ButtonExam";
import { fBService } from "../util/fbService";

const Main = () => {
  useEffect(() => {
    fBService.getAllReservation().then((result) => {
      console.log("%o", result);
    });
    fBService.getSearchCampSite().then((result) => {
      console.log("%o", result);
    });
  }, []);
  return (
    <div>
      <div>SAY HELLO</div>
      <ButtonExam />
      <TopBtn />
    </div>
  );
};
export default Main;
