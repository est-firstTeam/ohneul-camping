import React from "react";
const Footer = () => {
  return (
    <footer className="footer">
      <span className="footer__copyright">
        © {new Date().getFullYear()} Ohneul-Camping All rights reserved
      </span>
    </footer>
  );
};

export default Footer;
