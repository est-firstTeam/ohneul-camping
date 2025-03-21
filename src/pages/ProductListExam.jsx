import ProductList from "../components/ProductList";
import ProductListCart from "../components/ProductListCart";

const ProductListExam = (props) => {
  // 데이터 연결 후 props 사용하는 게 없어지면 props를 삭제해도 됨

  return (
    <>
      {/* 상품 리스트 : 메인 */}

      <ProductList stock={false} />

      {/* 상품 리스트 : 검색 결과 (예시)*/}
      <ProductList stock={true} />

      {/* 예약 확인 리스트 */}
      {/* <ProductListCart {...props} isCart={false} isRSV={true} /> */}

      {/* 결제+장바구니 리스트 */}
      {/* <ProductListCart {...props} isCart={true} isRSV={false} /> */}
    </>
  );
};

export default ProductListExam;
