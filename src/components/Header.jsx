import Logo from "./Logo";
import cart from "../../public/ico-cart.svg";
import search from "../../public/ico-search.svg";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const menus = [
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
      title: "마이페이지",
      path: "/my",
      iconPath: null,
    },
    {
      title: null,
      path: "/",
      iconPath: cart,
    },
    {
      title: null,
      path: "/",
      iconPath: search,
    },
  ];
  return (
    <header className="header">
      <Logo />
      <nav className="gnb">
        <ul className="gnb__list">
          {menus.map((menu, idx) => (
            <li key={idx} className="gnb__item">
              <button onClick={() => navigate(menu.path)}>
                <span className="gnb__item-text">
                  {menu.title && menu.title}
                </span>
                <span>
                  {menu.iconPath && (
                    <div>
                      <img src={menu.iconPath} />
                    </div>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
