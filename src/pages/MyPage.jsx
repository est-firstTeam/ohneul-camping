import { useEffect } from "react";
import MyPageNav from "../components/MyPageNav";
import MyPageContentLayout from "../layout/MyPageContentLayout";
import myPageTitleStore from "../store/mypageTitleStore";
import { useUserStore } from "../store/useUserStore";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const { title } = myPageTitleStore();
  const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, []);
  return (
    <section className="mypage">
      <h2 className="mypage__title">{title}</h2>
      <div className="mypage__inner">
        <MyPageNav />
        <MyPageContentLayout />
      </div>
    </section>
  );
};
export default MyPage;
