import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MyPageAside = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menus = props.menus;

  // 경로: /my/path -> activePath에는 path만 저장. undefined인 경우 첫번째 메뉴링크 사용
  const [activePath, setActivePath] = useState(
    location.pathname.split("/")[2] ?? menus[0].link
  );

  useEffect(() => {
    setActivePath(location.pathname.split("/")[2]);
  }, [location.pathname]);

  return (
    <aside className="mypage__aside">
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
                className={`mypage__btn-menu${isActiveMenu ? "--active" : ""}`}
              >
                {menu.title}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
export default MyPageAside;
