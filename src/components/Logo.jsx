import logo from "../../public/Logo.svg";
const Logo = () => {
  return (
    <div>
      <h1 className="logo__title">
        <a href="/">
          <img src={logo} alt="오늘캠핑" />
        </a>
      </h1>
    </div>
  );
};
export default Logo;
