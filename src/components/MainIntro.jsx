import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import img1 from "../images/img_camp01.png";
import img2 from "../images/img_camp02.png";
import img3 from "../images/img_firewood.png";

const MainIntro = () => {
  const leftVariants = {
    initial: {
      opacity: 0,
      x: -50,
    },
    entry: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2,
      },
    },
  };

  const rightVariants = {
    initial: {
      opacity: 0,
      x: +50,
    },
    entry: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.6,
      },
    },
  };

  const pVariants = {
    initial: {
      opacity: 0,
      x: +50,
    },
    entry: {
      opacity: 1,
      x: 0,
    },
  };

  const ohCampVariants = {
    initial: {
      opacity: 0,
      scale: 0,
    },
    entry: {
      opacity: [0, 0.5, 1],
      x: [0, -120, 0],
      scale: [0, 5, 1],
      rotateZ: [0, -65, 0],
      transition: {
        duration: 0.6,
        delay: 1,
        ease: [0, 2, 1, 1],
        // times: [0.1, 0.7, 1],
      },
    },
  };

  return (
    <section className="main__intro">
      <div className="main__intro-left-wrapper">
        <motion.div
          variants={leftVariants}
          initial="initial"
          whileInView="entry"
          className="intro-left__text-area"
        >
          <p>오늘 뭐 해? 캠핑 어때?</p>
          <h2>
            일상 탈출, 자연 속 힐링!
            <br />
            <motion.strong
              variants={ohCampVariants}
              initial="initial"
              whileInView="entry"
            >
              오캠
            </motion.strong>
            으로 떠나자!
          </h2>
        </motion.div>
        <motion.div
          className="intro-left__paragraph-area"
          variants={leftVariants}
          initial="initial"
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              delay: 0.4,
            },
          }}
        >
          <p variants={pVariants} className="main__intro-paragraph">
            가까운 캠핑장부터 핫한 명소까지, 원하는 곳을 쉽고 빠르게!
          </p>
          <p variants={pVariants} className="main__intro-paragraph">
            복잡한 예약은 NO! 오캠과 함께라면 캠핑 준비도 간편하게!
          </p>
          <p variants={pVariants} className="main__intro-paragraph">
            자연 속에서 쉬고, 먹고, 즐기는 완벽한 하루! 지금 떠나볼까?
          </p>
        </motion.div>
      </div>
      <motion.div
        variants={rightVariants}
        initial="initial"
        whileInView="entry"
        className="main__intro-right-wrapper"
      >
        <div className="intro__img-wrapper__left">
          <img src={img1} />
          <img src={img2} />
        </div>
        <div className="intro__img-wrapper__right">
          <img src={img3} />
        </div>
      </motion.div>
    </section>
  );
};

export default MainIntro;
