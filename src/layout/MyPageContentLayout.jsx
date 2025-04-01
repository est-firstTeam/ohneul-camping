import { Outlet } from "react-router-dom";
const MyPageContentLayout = () => {
  return (
    <section className="mypage__content">
      <Outlet />
    </section>
  );
};

export default MyPageContentLayout;
