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
import { useRef } from "react";
import Modal from "../components/Modal";
import { selectors } from "../util/selectors";

const Cart = () => {
  const userId = useUserStore((state) => state.id);
  const { data: carts, isLoading } = useQuery({
    queryKey: [`/cart/${userId}`],
    queryFn: () => fBService.fetchCartItems(userId),
    select: (data) => selectors.getUserCartItems(data),
  });

  const { setTitle } = myPageTitleStore();
  useEffect(() => {
    setTitle("나의 장바구니");
  }, []);

  const modalRef = useRef(null); // 위치 모달 관리
  const openModal = (currentModal) => {
    if (currentModal.current) {
      currentModal.current.showModal();
    }
  };

  // 환불규정 체크
  const [isAgree, setIsAgree] = useState(false);
  console.log(isAgree);
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
  console.log("this:", carts);
  if (isLoading) {
    return <div>loading</div>;
  }
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
          <div className="cart__agreement">
            <Checkbox id="agree" onChange={() => setIsAgree(!isAgree)} />
            <button onClick={() => openModal(modalRef)}>
              환불규정 및 약관 보기
            </button>
          </div>
        </section>
      </article>

      {/* 이용약관 환불규정 구현 */}
      <Modal modalRef={modalRef} completeText="동의합니다">
        <div className="cart__modal">
          <span className="cart__modal-title">이용 약관 및 환불규정</span>
          <span className="cart__modal-content-title">내용</span>
          <ul className="cart__modal-list">
            <li>
              본 사이트를 통해 예약한 캠핑장은 예약자 본인만 이용할 수 있습니다.
            </li>
            <li>
              예약자는 캠핑장 이용 수칙을 준수해야 하며, 시설 훼손 시 배상
              책임이 있습니다.
            </li>
            <li>현장 규정을 위반할 경우 이용이 제한될 수 있습니다.</li>
          </ul>
          <span className="cart__modal-content-title">환불 규정</span>
          <ul className="cart__modal-list">
            <li>이용일 2일 전까지 취소 시 100% 환불</li>
            <li>이용일 1일 전부터는 환불 불가</li>
            <li>
              천재지변 등 불가피한 사유로 캠핑장이 운영되지 않을 경우 전액
              환불됩니다.
            </li>
          </ul>
        </div>
      </Modal>
    </section>
  );
};
export default Cart;
