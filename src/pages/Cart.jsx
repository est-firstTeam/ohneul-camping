import { useEffect } from "react";
import myPageTitleStore from "../store/mypageTitleStore";
import Checkbox from "../components/Checkbox";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fBService } from "../util/fbService";
import ProductListCart from "../components/ProductListCart";
import { monthDateFormat } from "../util/util";
import { useUserStore } from "../store/useUserStore";
import { getDaysBetweenDates } from "../util/util";

const Cart = () => {
  const userId = useUserStore((state) => state.id);
  const { data: carts } = useQuery({
    queryKey: [`/cart/${userId}`],
    queryFn: () => fBService.getCartItems(userId),
  });
  // TODO: 해당하는 데이터 분리하기
  const { setTitle } = myPageTitleStore();
  useEffect(() => {
    setTitle("나의 장바구니");
  }, []);

  // 체크박스 데이터
  const initialCheckedItems = {};
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);
  const allChecked = Object.values(checkedItems).every(Boolean);

  useEffect(() => {
    const newCheckedState = {};

    if (carts) {
      carts.forEach((item) => {
        newCheckedState[item.id] = true;
      });
      setCheckedItems(newCheckedState);
    }
  }, [carts]);

  const handleSelectAll = () => {
    const newCheckedState = {};
    carts.forEach((item) => {
      newCheckedState[item.id] = !allChecked;
    });
    setCheckedItems(newCheckedState);
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteItem = (id) => {
    const newCarts = carts.filter((prev) => prev.id !== id);
    console.log("new:", newCarts);
    // TODO: 이 데이터를 새로 insert
  };

  return (
    <section className="cart">
      <h2 className="cart__title"></h2>
      {carts && (
        <Checkbox
          checked={allChecked}
          onChange={handleSelectAll}
          label="전체 선택"
        />
      )}

      {!carts ? (
        <div>장바구니가 비어 있습니다.</div>
      ) : (
        <div className={"cart__list"}>
          {carts.map((cartItem, index) => {
            return (
              <ProductListCart
                id={cartItem.id}
                key={index}
                firstImageUrl={cartItem.firstImageUrl}
                checked={checkedItems[cartItem.id] || false}
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
                handleCheckboxChange={() => handleCheckboxChange(cartItem.id)}
                handleDeleteItem={() => handleDeleteItem(cartItem.id)}
                isCart
              />
            );
          })}
        </div>
      )}
      <article>
        <h3>결제 금액</h3>
        <section>
          <span>옵션</span>
          <span>예약일자: {}</span>
          {carts &&
            carts.map((cart) => {
              if (checkedItems[cart.id]) {
                return cart.toString();
              }
            })}
        </section>
      </article>
      {/* <Modal /> */}
    </section>
  );
};
export default Cart;
