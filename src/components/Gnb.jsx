import { Link, useLocation, useNavigate } from "react-router-dom";
import useSectionRefStore from "../store/useSectionRefStore";

const Gnb = (props) => {
  const menus = props.menus;
  const { reservation, search } = useSectionRefStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (menu) => {
    if (menu.path) {
      navigate(menu.path);
    }
    let sectionRef;
    if (menu.sectionId === "search") {
      sectionRef = search;
    } else if (menu.sectionId === "reservation") {
      sectionRef = reservation;
    }
    if (!sectionRef) return;

    if (location.pathname === "/") {
      scrollToSection(sectionRef);
    } else {
      navigate("/");
      setTimeout(() => scrollToSection(sectionRef), 500);
    }
  };

  const scrollToSection = (ref) => {
    ref?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <nav className="gnb">
      <ul className="gnb__list">
        {menus.map((menu, idx) => (
          <li key={idx} className="gnb__item">
            <button key={idx} onClick={() => handleClick(menu)}>
              <span className="gnb__item-text">{menu.title && menu.title}</span>
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
  );
};
export default Gnb;
