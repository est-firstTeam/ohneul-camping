import { Outlet } from "react-router-dom";
const MyPageContentLayout = () => {
  return (
    <div className="mypage__content">
      <Outlet />
    </div>
  );
};

export default MyPageContentLayout;
