import topIcon from "./../images/ico-topbtn.svg";
import Button from "./Button";

const TopBtn = () => {
  const scrollToTop = () => {
    document.body.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Button
      color={"transparent"}
      icon={<img src={topIcon} width={"50px"} alt="Scroll to top" />}
      onClick={scrollToTop}
      className={"btn-top"}
      isIconOnly
    />
  );
};

export default TopBtn;
