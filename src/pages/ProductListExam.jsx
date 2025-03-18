import ProductList from "../components/ProductList";
import ProductListCart from "../components/ProductListCart";

const ProductListExam = (props) => {
  return (
    <>
      {/* 상품 리스트 : 메인 */}
      <ProductList {...props} stock={false} />
      {/* 상품 리스트 : 검색 결과 */}
      <ProductList {...props} stock={true} />
      {/* 예약 확인 리스트 */}
      <ProductListCart {...props} isCart={false} isRSV={true} />
      {/* 결제+장바구니 리스트 */}
      <ProductListCart {...props} isCart={true} isRSV={false} />
    </>
  );
};

export default ProductListExam;
