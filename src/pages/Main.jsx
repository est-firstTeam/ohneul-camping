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
  });

  return (
    <div>
      <TopBtn />
      <section className="main__intro">
        <div className="main__intro-left">
          <h3>오늘 뭐 해? 캠핑 어때?</h3>
          <h2>일상 탈출, 자연 속 힐링!</h2>
          <h2>
            <strong>오캠</strong>으로 떠나자!
          </h2>
        </div>
        <div className="main__intro-right"></div>
      </section>
    </div>
  );
};
export default Main;
