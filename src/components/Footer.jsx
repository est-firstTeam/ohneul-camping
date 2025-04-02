import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const [footerY, setFooterY] = useState(0);
  const [isScroll, setIsScroll] = useState(false);
  const location = useLocation(); // 현재 페이지 확인

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      if (scrollHeight > clientHeight) {
        setIsScroll(true);
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setFooterY(0);
        } else {
          setFooterY(100);
        }
      } else {
        setIsScroll(false);
        setFooterY(0); // 스크롤 없을 때 하단 고정
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const bodyHeight = document.body.scrollHeight;
    const clientHeight = window.innerHeight;

    if (bodyHeight <= clientHeight) {
      setFooterY(0); // 스크롤 없는 페이지로 이동하면 보이게
    } else {
      setFooterY(100); // 스크롤이 있으면 하단 고정
    }
  }, [location]);

  return (
    <motion.footer className="footer" style={{ y: footerY }}>
      <span className="footer__copyright">
        © {new Date().getFullYear()} Ohneul-Camping All rights reserved
      </span>
    </motion.footer>
  );
};

export default Footer;
