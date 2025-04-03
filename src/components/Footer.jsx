import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Link } from "react-router-dom";

const Footer = () => {
  const [footerY, setFooterY] = useState(100); // 기본값: 숨김
  const location = useLocation(); // 현재 페이지 확인

  const updateFooter = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    if (scrollHeight > clientHeight) {
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setFooterY(0);
      } else {
        setFooterY(100);
      }
    } else {
      if (scrollTop == 0) {
        // 최상단일때
        setFooterY(100);
      } else {
        setFooterY(0); // 스크롤 없을 때 하단 고정
      }
    }
  };

  useEffect(() => {
    // 새로고침 시 푸터 위치 설정(로딩 확인)
    const checkLoad = () => {
      setTimeout(updateFooter, 100); // 푸터 위치 체크
    };

    window.addEventListener("scroll", updateFooter);
    window.addEventListener("load", checkLoad);
    updateFooter(); // 로드된 후 실행함

    return () => {
      window.removeEventListener("scroll", updateFooter);
      window.removeEventListener("load", checkLoad);
    };
  }, []);

  useEffect(() => {
    setFooterY(100); // 페이지 이동 시 푸터 초기화

    setTimeout(() => {
      updateFooter();
    }, 50);
  }, [location]);

  return (
    <motion.footer className="footer" style={{ y: footerY }}>
      <span className="footer__copyright">
        © {new Date().getFullYear()} Ohneul-Camping All rights reserved.
      </span>
      <Link to={"/team"}>
        <p className="footer__member">About us</p>
      </Link>
    </motion.footer>
  );
};

export default Footer;
