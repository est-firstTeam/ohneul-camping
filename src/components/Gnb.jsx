import { Link, useLocation, useNavigate } from "react-router-dom";
import useSectionRefStore from "../store/useSectionRefStore";
import { useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

const Gnb = (props) => {
  const menus = props.menus;
  const { reservation, search } = useSectionRefStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(menus[0]);

  const handleClick = (menu) => {
    setSelectedTab(menu);
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
          <motion.li
            key={idx}
            className="gnb__item"
            style={
              selectedTab === menu
                ? {
                    borderBottom: "1px solid #f57b21",
                    borderRadius: "30%",
                    boxShadow: "0px 6px 6px -6px #f57b21",
                  }
                : {
                    borderBottom: "0px",
                    borderRadius: "none",
                    boxShadow: "none",
                  }
            }
            // layoutId="underline"
            // id="underline"
          >
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
          </motion.li>
        ))}
      </ul>
    </nav>
  );
};
export default Gnb;
