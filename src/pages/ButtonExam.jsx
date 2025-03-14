import Button from "../components/Button";
import fav from "../../public/favicon.svg";
import right_arr from "../images/ico-rightArrow.svg";
import cart from "../images/ico-cart.svg";

const ButtonExam = () => {
  const onclickHandler = () => {
    alert("hihi");
  };
  return (
    <div>
      {/* primary 색상 + size small + 커스텀 onclick 가능 */}
      <Button color={"primary"} size={"small"} onClick={onclickHandler}>
        text
      </Button>
      {/* primary 색상 + size midium + 커스텀 onclick 가능 */}
      <Button color={"primary"} size={"midium"} onClick={onclickHandler}>
        text
      </Button>
      {/* primary 색상 + icon 생성 + icon 위치 오른쪽 + 커스텀 onclick 가능 */}
      <Button
        color={"primary"}
        icon={<img src={right_arr} />}
        onClick={onclickHandler}
        iconPosition="right"
      >
        검색
      </Button>
      {/* primary 색상 + size large + disabled + 커스텀 onclick 가능 */}
      <Button
        color={"primary"}
        size={"large"}
        disabled={"disabled"}
        onClick={onclickHandler}
      >
        text
      </Button>
      {/* secondary 색상 + padding 커스텀 설정 */}
      <Button color={"secondary"} padding={"1rem 2rem"}>
        날짜
      </Button>

      {/* <Button color={"white"}>안녕하세요</Button> */}

      {/* secondary 색상 + btn-location(글자 검은색) 커스텀 설정 */}
      <Button className={"btn-location"} color={"secondary"}>
        어디로 가세요?
      </Button>
      {/* secondary 색상 + 아이콘 생성 + 아이콘 위치 왼쪽 고정 */}
      <Button color={"secondary"} icon={<img src={fav} />}>
        날짜 및 일정
      </Button>
      {/* secondary 색상 + 아이콘 생성 + 아이콘 위치 오른쪽 */}
      <Button color={"secondary"} icon={<img src={fav} />} iconPosition="right">
        날짜 및 일정
      </Button>
      {/* primary 색상 + 아이콘 생성 + 아이콘만 존재 */}
      <Button color={"primary"} icon={<img src={cart} />} isIconOnly></Button>
    </div>
  );
};
export default ButtonExam;
