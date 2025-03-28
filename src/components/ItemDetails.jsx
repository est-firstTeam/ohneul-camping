// 상품 리스트 : 아이템
const CLASS_MAP = {
  title: {
    small: "detail-list__title detail-list__title--small",
    large: "detail-list__title detail-list__title--large",
    chked: "detail-list__title detail-list__title--chked",
  },
  text: {
    gray: "detail-list__text detail-list__text--gray",
    black: "detail-list__text detail-list__text--black",
    red: "detail-list__text detail-list__text--red",
  },
  price: {
    default: "detail-list__price detail-list__price--def",
    disabled: "detail-list__price detail-list__price--disabled",
    reserved: "detail-list__price detail-list__price--rsv",
  },
  unit: {
    default: "detail-list__unit detail-list__unit--def",
    disabled: "detail-list__unit detail-list__unit--disabled",
    reserved: "detail-list__unit detail-list__unit--rsv",
  },
};

const ItemDetails = ({ type, size, color, children }) => {
  const className = CLASS_MAP[type]?.[size || color] || "";
  return <div className={className}>{children}</div>;
};

export default ItemDetails;
