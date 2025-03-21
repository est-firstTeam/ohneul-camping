import { useEffect } from "react";
import TopBtn from "./../components/Topbtn";
import ButtonExam from "./ButtonExam";
import { fBService } from "../util/fbService";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();
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
      <div>
        <button
          onClick={() => {
            navigate("/detail");
          }}
        >
          상세페이지 가기
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            navigate("/searchResult");
          }}
        >
          검색결과 페이지 가기
        </button>
      </div>
      <TopBtn />
    </div>
  );
};
export default Main;
