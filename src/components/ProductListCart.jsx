import ItemDetails from "./ItemDetails";
import Checkbox from "./Checkbox";

//TODO
// - data 연결
// - 체크박스 : 컴포넌트로 수정하기
// - selected(선택 상품 수) 값이 없을 경우 : 보이지 않게 처리
// - startDate가 오늘 이전일 경우 (오늘 포함) : 취소 불가 버튼이 보이게

// 마이페이지 상품 리스트
const ProductListCart = ({
  firstImageUrl,
  facltNm,
  startDate,
  endDate,
  day,
  selected1,
  selected2,
  selected3,
  selected4,
  sumPrice, // 옵션 합산 가격
  isRSV, // 장바구니 (true)
  isCart, // 예약 확인 (true)
}) => {
  return (
    <div className="product product__w-26">
      <img src={firstImageUrl} className="product__image" />
      <div className="detail-list">
        <ul>
          {/* 장바구니에서만 true */}
          <ItemDetails bold={true} overflow={true} mb="20">
            {isRSV && <input type="checkbox" id="ck" />}
            <label for="ck">{facltNm} 예약한 야영장의 이름</label>
          </ItemDetails>
          <ItemDetails
            text={`${startDate} ~ ${endDate} (${day}박)`}
            color={"gray3"}
            mb="20"
          />
          <ItemDetails
            text={`소 ${selected1} 자리`}
            inline={true}
            color={"gray3"}
          />
          <ItemDetails text={`,`} inline={true} color={"gray3"} />
          <ItemDetails
            text={`중 ${selected2} 자리`}
            inline={true}
            color={"gray3"}
          />
          <ItemDetails text={`,`} inline={true} color={"gray3"} />
          <ItemDetails
            text={`대 ${selected3} 자리`}
            inline={true}
            color={"gray3"}
          />
          <ItemDetails text={`,`} inline={true} color={"gray3"} />
          <ItemDetails
            text={`카라반 ${selected4} 자리`}
            inline={true}
            color={"gray3"}
          />
          <ItemDetails
            text={`${sumPrice}`}
            color={"primary"}
            fontSize="20"
            bold={true}
            mb="0"
            mr={true}
            inline={true}
          />
          <ItemDetails
            text={`원 ~`}
            color={"primary"}
            fontSize="20"
            mb="0"
            inline={true}
          />
        </ul>
      </div>
      {/* 예약 확인에서만 true */}
      {isCart && (
        <Button color={"primary"} size={"midium"} margin={"1rem"}>
          예약 취소
        </Button>
      )}
    </div>
  );
};

export default ProductListCart;
