import { useEffect } from "react";
import myPageTitleStore from "../store/mypageTitleStore";

const Cart = () => {
  const { setTitle } = myPageTitleStore();
  useEffect(() => {
    setTitle("나의 장바구니");
  }, []);
  // TODO: 장바구니 페이지 구현 예정
  return <section>장바구니 페이지 입니다.</section>;
};
export default Cart;
