import cart from "../images/ico-cart.svg";
import search from "../images/ico-search.svg";
export const menus = [
  {
    title: "홈",
    path: "/",
    iconPath: null,
  },
  // TODO: 모든 캠핑장 정보로 스크롤
  {
    title: "예약",
    path: "/",
    iconPath: null,
  },
  {
    title: null,
    path: "my/cart",
    iconPath: cart,
  },
  {
    title: null,
    path: "/",
    iconPath: search,
  },
];
