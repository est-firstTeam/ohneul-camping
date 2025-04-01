import MyPageNav from "../components/MyPageNav";
import MyPageContentLayout from "../layout/MyPageContentLayout";
import myPageTitleStore from "../store/mypageTitleStore";

const MyPage = () => {
  const { title } = myPageTitleStore();

  return (
    <section className="mypage">
      <div className="mypage__title">{title}</div>
      <hr className="mypage__hr" />
      <div className="mypage__inner">
        <MyPageNav />
        <MyPageContentLayout />
      </div>
    </section>
  );
};
export default MyPage;
