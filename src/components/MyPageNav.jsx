import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MyPageNav = () => {
  const menus = [
    {
      title: "예약 현황",
      link: "reservation",
    },
    {
      title: "정보 변경",
      link: "account",
    },
    {
      title: "장바구니",
      link: "cart",
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  // 경로: /my/path -> activePath에는 path만 저장. undefined인 경우 첫번째 메뉴링크 사용
  const [activePath, setActivePath] = useState(
    location.pathname.split("/")[2] ?? menus[0].link
  );

  useEffect(() => {
    setActivePath(location.pathname.split("/")[2]);
  }, [location.pathname]);

  return (
    <nav className="mypage__nav">
      <ul>
        {menus.map((menu) => {
          const isActiveMenu = activePath === menu.link;
          return (
            <li key={menu.link}>
              <button
                color="text"
                onClick={() => {
                  setActivePath(menu.link);
                  navigate(`${menu.link}`);
                }}
                className={`mypage__btn-menu ${
                  isActiveMenu ? "mypage__btn-menu--active" : ""
                }`}
              >
                {menu.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
export default MyPageNav;
