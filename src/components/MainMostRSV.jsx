import ProductList from "./ProductList";

export default function MainMostRSV() {
  return (
    <section className="rsv-most" title="예약이 가장 많은 캠핑장">
      <div className="rsv-most-header">
        <h3>오늘의 픽텐트!</h3>
        <h2>예약이 가장 많은 캠핑장</h2>
      </div>
      <ProductList />
    </section>
  );
}
