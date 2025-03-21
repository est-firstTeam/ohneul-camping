import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import Gnb from "./Gnb";
import { menus } from "../constants/headerMenus";

const Header = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0); // 마지막 스크롤 위치를 저장하는 state

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // 스크롤이 아래로 진행되었는지 확인
        setShowNav(false);
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

  return (
    <header className={`header ${showNav ? "" : "header--hide"}`}>
      <Logo />
      <div className="header__inner">
        <Gnb menus={menus} />
        <button
          className="header__auth-btn"
          onClick={() => {
            // TODO:로그인 안되어있으면 로그인 모달 오픈
            isLoggedIn ? navigate("/my") : navigate("/Login");
          }}
        >
          {isLoggedIn ? "마이페이지" : "로그인/회원가입"}
        </button>
      </div>
    </header>
  );
};

export default Header;
