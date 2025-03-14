import logo from "../../public/Logo.svg";
const Logo = () => {
  return (
    <div>
      <h1 className="logo__title">오늘캠핑</h1>
      <a href="/">
        <img src={logo} />
      </a>
    </div>
  );
};
export default Logo;
