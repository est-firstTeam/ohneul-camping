import { useEffect } from "react";
import myPageTitleStore from "../store/mypageTitleStore";
import Checkbox from "../components/Checkbox";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fBService } from "../util/fbService";
import ProductListCart from "../components/ProductListCart";
import { monthDateFormat } from "../util/util";

const Cart = () => {
  const { data: carts } = useQuery({
    queryKey: [`/cart/id`], //TODO: userId
    queryFn: () => fBService.getCartItems("pDzbEYJz5DdiRgkCbafD2NCwe0R2"),
  });

  const initialCheckedItems = {};
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);

  const allChecked = Object.values(checkedItems).every(Boolean);

  const handleSelectAll = () => {
    const newCheckedState = {};
    carts.forEach((item) => {
      newCheckedState[item] = !allChecked;
    });
    setCheckedItems(newCheckedState);
  };
  function getDaysBetweenDates(startDate, endDate) {
    // 문자열을 Date 객체로 변환
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 시간, 분, 초, 밀리초를 0으로 설정하여 날짜만 고려
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // 밀리초 단위로 차이 계산
    const diffTime = Math.abs(end - start);

    // 밀리초를 일 단위로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리초)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays);
    return diffDays;
  }

  // useEffect(() => {
  //   if (carts) {
  //     console.log("cart:%o", carts[0].data.userBasket);
  //     setCheckedItems(() => carts[0].data.userBasket);
  //   }
  // }, [carts]);
  // TODO : 체크박스 연동
  useEffect(() => {
    console.log("checked?: %o", checkedItems);
  }, [checkedItems]);

  const { setTitle } = myPageTitleStore();
  useEffect(() => {
    setTitle("나의 장바구니");
  }, []);
  const hasCartItems =
    carts &&
    carts[0] &&
    carts[0].data &&
    carts[0].data.userBasket &&
    carts[0].data.userBasket.length > 0;

  return (
    <section className="cart">
      <h2 className="cart__title"></h2>
      {hasCartItems && (
        <Checkbox
          checked={allChecked}
          onClick={handleSelectAll}
          label="전체 선택"
        />
      )}

      {!hasCartItems ? (
        <div>장바구니가 비어 있습니다.</div>
      ) : (
        carts[0].data.userBasket.map((cartItem) => {
          return (
            <ProductListCart
              firstImageUrl={cartItem.firstImageUrl}
              startDate={monthDateFormat(cartItem.rsvStartDate)}
              endDate={monthDateFormat(cartItem.rsvEndDate)}
              day={getDaysBetweenDates(
                cartItem.rsvStartDate,
                cartItem.rsvEndDate
              )}
              facltNm={cartItem.facltNm}
              selected1={cartItem.rsvSiteS}
              selected2={cartItem.rsvSiteM}
              selected3={cartItem.rsvSiteL}
              selected4={cartItem.rsvSiteC}
              sumPrice={cartItem.rsvTotalPrice}
              isCart
            />
          );
        })
      )}
    </section>
  );
};
export default Cart;
