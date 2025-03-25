const MainIntro = () => {
  return (
    <div>
      <section title="메인페이지소개" className="main__intro">
        <div className="main__intro-left-wrapper">
          <div className="intro-left__text-area">
            <h3>오늘 뭐 해? 캠핑 어때?</h3>
            <h2>일상 탈출, 자연 속 힐링!</h2>
            <h2>
              <strong>오캠</strong>으로 떠나자!
            </h2>
          </div>
          <div className="intro-left__paragraph-area">
            <p className="main__intro-paragraph">
              가까운 캠핑장부터 핫한 명소까지, 원하는 곳을 쉽고 빠르게!
            </p>
            <p className="main__intro-paragraph">
              복잡한 예약은 NO! 오캠과 함께라면 캠핑 준비도 간편하게!
            </p>
            <p className="main__intro-paragraph">
              자연 속에서 쉬고, 먹고, 즐기는 완벽한 하루! 지금 떠나볼까?
            </p>
          </div>
        </div>
        <div className="main__intro-right-wrapper">
          <div className="intro__img-wrapper__left">
            <img src="/src/images/img_camp01.png" alt="캠핑이미지01" />
            <img src="/src/images/img_camp02.png" alt="캠핑이미지02" />
          </div>
          <div className="intro__img-wrapper__right">
            <img src="/src/images/img_firewood.png" alt="캠핑이미지02" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainIntro;
