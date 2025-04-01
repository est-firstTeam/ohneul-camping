import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import HeaderSelectBox from "./HeaderSelect";
import useHeaderStore from "../store/useHeaderStore";
import useSectionRefStore from "../store/useSectionRefStore";
import searchIcon from "../images/ico-search.svg";
import profileimg from "../images/ico_profile.svg";

const Header = () => {
  const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0); // 마지막 스크롤 위치를 저장하는 state
  const [showSelect, setShowSelect] = useState(false);
  const { selects } = useHeaderStore();
  const { search } = useSectionRefStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // 스크롤이 아래로 진행되었는지 확인
        setShowNav(false);
        setShowSelect(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY); // 마지막 스크롤 위치 업데이트
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 클린업 함수에서 이벤트 리스너 제거
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]); // lastScrollY가 변경될 때마다 useEffect가 실행됩니다.

  const handleClick = () => {
    if (location.pathname === "/") {
      scrollToSection(search);
    } else {
      navigate("/");
      setTimeout(() => scrollToSection(search), 500);
    }
  };

  const scrollToSection = (ref) => {
    ref?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <motion.header
      animate={(showNav) => ({
        y: showNav ? 0 : -144,
        transition: { duration: 0.3 },
      })}
      custom={showNav}
      className={`header`}
    >
      <Logo />
      <div className="header__inner">
        <button onClick={handleClick}>
          <img src={searchIcon} />
        </button>
        <button
          className="header__auth-btn"
          onClick={() => {
            isLoggedIn ? setShowSelect((prev) => !prev) : navigate("/Login");
          }}
        >
          {isLoggedIn ? (
            <>
              <img
                className="header__img-path"
                src={imgPath === null ? { profileimg } : imgPath}
              />
              {showSelect && <HeaderSelectBox valueArr={selects} />}
            </>
          ) : (
            <span className="gnb__item-text">로그인/회원가입</span>
          )}
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
