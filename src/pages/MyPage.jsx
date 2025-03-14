import MyPageAside from "../components/MyPageAside";
import MyPageContentLayout from "./MyPageLayout";

const MyPage = () => {
  const menus = [
    {
      title: "예약 현황",
      link: "/reservation",
    },
    // {
    //   title: "정보 변경",
    //   link: "/information",
    // },
    {
      title: "장바구니",
      link: "/cart",
    },
  ];
  return (
    <section className="mypage">
      <div className="mypage__title">오캠님, 반가워요!</div>
      <hr className="mypage__hr" />
      <div className="mypage__inner">
        <MyPageAside menus={menus} />
        <MyPageContentLayout />
      </div>
    </section>
  );
};
export default MyPage;
