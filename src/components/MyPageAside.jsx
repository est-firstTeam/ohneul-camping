import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyPageAside = (props) => {
  const [activeIdx, setActiveIdx] = useState(null);
  const menus = props.menus;
  const navigate = useNavigate();
  return (
    <aside>
      <ul>
        {menus.map((menu, idx) => {
          const isActiveMenu = activeIdx === idx;
          return (
            <li>
              <button
                onClick={() => {
                  setActiveIdx(idx);
                  navigate(menus.link);
                }}
                className={`mypage__btn-menu ${isActiveMenu ? "--active" : ""}`}
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
