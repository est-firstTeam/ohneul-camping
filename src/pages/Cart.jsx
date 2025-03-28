import { useEffect } from "react";
import myPageTitleStore from "../store/mypageTitleStore";
import Checkbox from "../components/Checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fBService } from "../util/fbService";
import ProductListCart from "../components/ProductListCart";
import { monthDateFormat } from "../util/util";
import { useUserStore } from "../store/useUserStore";
import { getDaysBetweenDates } from "../util/util";
import { useRef } from "react";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/Loading";
import DetailOptionBox from "../components/DetailOptionBox";
import Button from "../components/Button";

const Cart = () => {
  const userId = useUserStore((state) => state.id);
  const [amountToPay, setAmountToPay] = useState(0);

  const { data: carts, isLoading } = useQuery({
    queryKey: [`/cart/${userId}`],
    queryFn: async () => {
      const users = await fBService.fetchUser(userId);
      return fBService.getUserCartItems(users);
    },
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

  // 체크박스 데이터
  const initialCheckedItems = {};
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);
  const allChecked = Object.values(checkedItems).every(Boolean);

  useEffect(() => {
    const newCheckedState = {};
    if (Array.isArray(carts) && carts.length > 0) {
      carts.forEach((item) => {
        newCheckedState[item.id] = true;
      });
      setCheckedItems(newCheckedState);
    }
  }, [carts]);

  useEffect(() => {
    // 총 결제 가격 계산
    if (carts) {
      const total = carts.reduce((acc, cart) => {
        return checkedItems[cart.id] ? acc + cart.rsvTotalPrice : acc;
      }, 0);

      setAmountToPay(total);
    }
  }, [checkedItems]);

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

  const payMutation = useMutation({
    mutationFn: async ({ notToPayItems }) => {
      // 유저 장바구니에서 제거
      await fBService.insertUserCart(userId, notToPayItems);
      // TODO: available rsv에서 - 1
      // 예약데이터 생성
      // rsvComplete + 1
    },
  });

  // TODO: 결제할(체크된) 아이템을 한번에 배열에 담는변수 생성 -> 다른 로직에서 사용
  const handleOrder = () => {
    const toPayItems = carts.filter((cart) => checkedItems[cart.id]); // 결제할 아이템
    const notToPayItems = carts.filter((cart) => !checkedItems[cart.id]); // 결제하지 않을 아이템들을 장바구니에 새로 set

    payMutation.mutate({ notToPayItems });
  };

  let hasItemToPay; // 결제할 아이템이 있는지 확인하는 변수
  if (carts) {
    hasItemToPay =
      carts.map((cart) => checkedItems[cart.id]).indexOf(true) === -1
        ? false
        : true;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <section className="cart">
      <h2 className="cart__title"></h2>
      {carts && carts.length > 0 && (
        <Checkbox
          checked={allChecked}
          onChange={handleSelectAll}
          label="전체 선택"
        />
      )}
      {!carts || carts.length === 0 ? (
        <div>장바구니가 비어 있습니다.</div>
      ) : (
        <div className={"cart__list"}>
          {Array.isArray(carts) &&
            carts.length > 0 &&
            carts.map((cartItem, index) => {
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
      {Array.isArray(carts) && hasItemToPay && (
        <article className="cart__expected-payment">
          <h3 className="cart__expected-payment-title">결제 금액</h3>
          <section>
            {Array.isArray(carts) &&
              carts.length > 0 &&
              carts.map((cart) => {
                if (checkedItems[cart.id]) {
                  return (
                    <div className="cart__detail-option-box" key={cart.id}>
                      <DetailOptionBox
                        startDate={cart.rsvStartDate}
                        endDate={cart.rsvEndDate}
                        siteCounts={[
                          cart.rsvSiteS,
                          cart.rsvSiteM,
                          cart.rsvSiteL,
                          cart.rsvSiteC,
                        ]}
                        campData={cart}
                        nightCount={getDaysBetweenDates(
                          cart.rsvStartDate,
                          cart.rsvEndDate
                        )}
                      />
                      <div className="cart__detail-option-box-total">
                        <span>선택 상품 금액</span>
                        <span className="cart__detail-option-box-total-price">
                          {cart.rsvTotalPrice}원
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
            <hr />
            <div className="cart__agreement">
              <Checkbox id="agree" onChange={() => setIsAgree(!isAgree)} />
              <button onClick={() => openModal(modalRef)}>
                환불규정 및 약관동의 (보기)
              </button>
            </div>
            <div className="cart__amount-to-pay">
              <div>결제 예정 금액</div>
              <span className="cart__amount-to-pay-price">
                {amountToPay} 원
              </span>
            </div>
            <Button
              className="cart__order-btn"
              disabled={!isAgree}
              width={"100%"}
              height={"58px"}
              onClick={handleOrder}
            >
              예약하기
            </Button>
          </section>
        </article>
      )}
      {/* 이용약관 환불규정 구현 */}
      <Modal
        modalRef={modalRef}
        completeText="동의합니다"
        text={"완료"}
        confirmBtn
      >
        <div className="cart__modal">
          <span className="cart__modal-title">이용 약관 및 환불규정</span>
          <span className="cart__modal-content-title">내용</span>
          <ul className="cart__modal-list">
            <li>
              결제 예정 금액은 예약시 결제되는것이 아닌, 현장결제를 통해
              지불하실 금액입니다.
            </li>
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
