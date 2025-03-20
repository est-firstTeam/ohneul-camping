import myPageTitleStore from "../store/mypageTitleStore";
import { useEffect } from "react";

const Reservation = () => {
  const { setTitle } = myPageTitleStore();
  useEffect(() => {
    setTitle("오캠님, 반가워요!");
  }, []);
  return <section>예약현황 페이지 입니다.</section>;
};
export default Reservation;
