import { Outlet } from "react-router-dom";
// TODO: layout폴더로 옮기기
const MyPageContentLayout = () => {
  return (
    <section className="mypage__content">
      <Outlet />
    </section>
  );
};

export default MyPageContentLayout;
