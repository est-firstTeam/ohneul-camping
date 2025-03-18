import ItemDetails from "./ItemDetails";

// 상품 리스트
const ProductList = ({
  firstImageUrl,
  facltNm,
  doNm,
  sigunguNm,
  induty,
  siteMg1Co,
  siteMg2Co,
  siteMg3Co,
  caravSiteCo,
  price, // 상품 (최소) 가격
  stock, // 재고 (메인: false / 검색결과: true)
}) => {
  return (
    <div className="product product__w-35">
      <img src={firstImageUrl} className="product__image" />
      <div className="detail-list">
        <ul>
          <ItemDetails
            text={`${facltNm} 야영장의 이름`}
            fontSize="32"
            bold={true}
            overflow={true}
            mb="20"
          />
          <ItemDetails
            text={`${doNm} ${sigunguNm} 전라남도 담양시`}
            color={"gray3"}
          />
          <ItemDetails
            text={`#${induty} 글램핑 카라반`}
            color={"gray3"}
            mb="20"
          />

          {/* true => SearchResult */}
          {/* false => Main */}
          {stock && (
            <>
              <ItemDetails text={`남은 자리`} bold={true} />
              <ItemDetails text={`소 ${siteMg1Co} 자리`} inline={true} />
              <ItemDetails text={`/`} inline={true} />
              <ItemDetails text={`중 ${siteMg2Co} 자리`} inline={true} />
              <ItemDetails text={`/`} inline={true} />
              <ItemDetails text={`대 ${siteMg3Co} 자리`} inline={true} />
              <ItemDetails text={`/`} inline={true} />
              <ItemDetails text={`카라반 ${caravSiteCo} 자리`} inline={true} />
            </>
          )}

          <ItemDetails
            text={`${price} `}
            fontSize="32"
            bold={true}
            mb="0"
            mr={true}
            inline={true}
          />
          <ItemDetails text={`원 ~`} fontSize="24" mb="0" inline={true} />
        </ul>
      </div>
    </div>
  );
};

export default ProductList;
