import { useEffect } from "react";
import myPageTitleStore from "../store/mypageTitleStore";
import Checkbox from "../components/Checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fBService } from "../util/fbService";
import ProductListCart from "../components/ProductListCart";
import { useUserStore } from "../store/useUserStore";
import {
  getDaysBetweenDates,
  commaNumber,
  getDatesInRange,
  monthDateFormat,
} from "../util/util";
import { useRef } from "react";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/Loading";
import DetailOptionBox from "../components/DetailOptionBox";
import Button from "../components/Button";
import { firebaseDB } from "../firebaseConfig";
import { doc } from "firebase/firestore";
import { runTransaction } from "firebase/firestore";
import RefundModal from "../components/RefundModal";

const Cart = () => {
  const userId = useUserStore((state) => state.id);
  const [amountToPay, setAmountToPay] = useState(0);

  const {
    data: carts,
    isLoading,
    refetch,
  } = useQuery({
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

  const cannotPaymentRef = useRef(null); // 결제 불가 모달
  const handleCancel = () => {
    if (cannotPaymentRef.current) {
      cannotPaymentRef.current.close();
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

  const handleDeleteItem = async (id) => {
    const newCarts = carts.filter((prev) => prev.campSiteId !== id);
    if (newCarts.length) {
      await fBService.insertUserCart(userId, newCarts);
      refetch();
    }
  };

  const payMutation = useMutation({
    mutationFn: async ({ toPayItems, notToPayItems }) => {
      await fBService.insertUserCart(userId, notToPayItems); // 유저 장바구니에서 제거

      // available rsv에서 - 1
      // doNm_date로 document조회
      toPayItems.forEach(async (toPayItem) => {
        const datesInRange = getDatesInRange(
          toPayItem.rsvStartDate,
          toPayItem.rsvEndDate
        );

        // Available_RSV 문서 조회
        for (const date of datesInRange) {
          const docId = `${toPayItem.doNm}_${date}`; //  doNm_date 문자열 제작
          const docRef = doc(firebaseDB, "Available_RSV", docId); // 조회

          try {
            // 재고 감소
            runTransaction(firebaseDB, async (transaction) => {
              const docSnap = await transaction.get(docRef);
              if (!docSnap.exists()) return;

              const availableData = docSnap.data();
              const contentArray = availableData.content || [];

              // site와 rsvSite 매칭해서 연산
              const updatedContentArray = contentArray.map((item) => {
                if (
                  item.contentId.toString() === toPayItem.campSiteId.toString()
                ) {
                  let { siteS, siteM, siteL, siteC } = item;
                  const afterPayRsvSiteS = (siteS ?? 0) - toPayItem.rsvSiteS;
                  const afterPayRsvSiteM = (siteM ?? 0) - toPayItem.rsvSiteM;
                  const afterPayRsvSiteL = (siteL ?? 0) - toPayItem.rsvSiteL;
                  const afterPayRsvSiteC = (siteC ?? 0) - toPayItem.rsvSiteC;

                  // 결제할때 현재 재고가 없으면 결제 못함
                  if (
                    afterPayRsvSiteS >= 0 &&
                    afterPayRsvSiteM >= 0 &&
                    afterPayRsvSiteL >= 0 &&
                    afterPayRsvSiteC >= 0
                  ) {
                    siteS = afterPayRsvSiteS;
                    siteM = afterPayRsvSiteM;
                    siteL = afterPayRsvSiteL;
                    siteC = afterPayRsvSiteC;
                  } else {
                    openModal(cannotPaymentRef);
                    return;
                  }

                  return { ...item, siteS, siteM, siteL, siteC };
                }
                return item;
              });

              transaction.update(docRef, {
                content: updatedContentArray,
              });
            });

            console.log(`DB 업데이트 완료: ${docId}`);
          } catch (error) {
            console.error(`DB 업데이트 실패: ${error}`);
          }
        }
        // 예약데이터 생성
        const rsvData = {
          campSiteId: toPayItem.campSiteId,
          doNm: toPayItem.doNm,
          facltNm: toPayItem.facltNm,
          firstImageUrl: toPayItem.firstImageUrl,
          rsvEndDate: toPayItem.rsvEndDate,
          rsvIsCanceled: false,
          rsvSiteC: toPayItem.rsvSiteC,
          rsvSiteL: toPayItem.rsvSiteL,
          rsvSiteM: toPayItem.rsvSiteM,
          rsvSiteS: toPayItem.rsvSiteS,
          rsvStartDate: toPayItem.rsvStartDate,
          rsvTotalPrice: toPayItem.rsvTotalPrice,
          userId: userId,
        };

        await fBService.insertReservation(rsvData);
        await fBService.increaseRsvComplete(toPayItem.campSiteId); // rsvComplete + 1
      });
    },
  });

  const handleOrder = () => {
    const toPayItems = carts.filter((cart) => checkedItems[cart.id]); // 결제할 아이템
    const notToPayItems = carts.filter((cart) => !checkedItems[cart.id]); // 결제하지 않을 아이템들을 장바구니에 새로 set

    payMutation.mutate({ toPayItems, notToPayItems });
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
                  handleDeleteItem={() => handleDeleteItem(cartItem.campSiteId)}
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
              carts.map((cart, index) => {
                if (checkedItems[cart.id]) {
                  return (
                    <div className="cart__detail-option-box" key={index}>
                      <span className="cart__detail-option-facltNm">
                        {cart.facltNm}
                      </span>
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
                          {commaNumber(cart.rsvTotalPrice)}원
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
            <div className="cart__agreement">
              <Checkbox id="agree" onChange={() => setIsAgree(!isAgree)} />
              <button onClick={() => openModal(modalRef)}>
                환불규정 및 약관동의 (보기)
              </button>
            </div>
            <div className="cart__amount-to-pay">
              <div>결제 예정 금액</div>
              <span className="cart__amount-to-pay-price">
                {commaNumber(amountToPay)} 원
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
      <RefundModal modalRef={modalRef} />

      {/* 예약불가 모달 */}
      <Modal
        modalRef={cannotPaymentRef}
        handleConfirm={handleCancel}
        text={"확인"}
        confirmBtn={true}
        buttonType={"button"}
      >
        남은 자리가 없습니다
      </Modal>
    </section>
  );
};
export default Cart;
