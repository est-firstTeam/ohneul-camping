import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const HeaderSelectBox = ({ valueArr }) => {
  const navigate = useNavigate();
  const { resetUser } = useUserStore();

  const handleLogout = () => {
    resetUser();
    useUserStore.persist.clearStorage();
    navigate("/");
  };

  const handleChangeOption = (e) => {
    const { innerText } = e.target;
    switch (innerText) {
      case "예약현황":
        navigate("/my/reservation");
        break;
      case "장바구니":
        navigate("/my/cart");
        break;
      case "로그아웃":
        handleLogout();
        break;
      case "정보변경":
        navigate("/my/account");
        break;
      default:
        return;
    }
  };

  return (
    <>
      <div className="header-select">
        <ul className="header-list">
          {valueArr?.map((arr, index) => (
            <li
              key={index}
              className="header-item"
              value={arr}
              onClick={handleChangeOption}
            >
              {arr}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HeaderSelectBox;
