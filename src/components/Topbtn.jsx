import topIcon from "./../images/ico-topbtn.svg";
import Button from "./Button";

const TopBtn = () => {
  const scrollToTop = () => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Button
      color={"transparent"}
      icon={<img src={topIcon} width={"50px"} alt="상단으로 이동하기" />}
      onClick={scrollToTop}
      className={"top-btn"}
      isIconOnly
    />
  );
};

export default TopBtn;
