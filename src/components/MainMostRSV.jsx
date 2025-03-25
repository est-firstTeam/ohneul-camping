import { useQuery } from "@tanstack/react-query";
import ProductList from "./ProductList";
import { fBService } from "../util/fbService";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import ProductMain from "./ProductCard";
import Button from "./Button";

export default function MainMostRSV() {
  const offset = 3;
  const [sliderIdx, setSliderIdx] = useState(0);
  const [back, setBack] = useState(false);
  const { data, error, status } = useQuery({
    queryKey: ["sortCampsiteByRsvComplete"],
    queryFn: async () => fBService.getAllCampsites(),
    select: (data) => {
      const sortedArr = data
        .sort((a, b) => b.data.rsvComplete - a.data.rsvComplete)
        .slice(0, 10);
      return sortedArr;
    },
  });
  const nextBtn = () => {
    setBack(false);
    const maxIdx = Math.floor(data.length / offset);
    setSliderIdx((prev) => (prev === maxIdx ? maxIdx : prev + 1));
    console.log("sliderIdx ->", sliderIdx);
  };
  const prevBtn = () => {
    setBack(true);
    setSliderIdx((prev) => (prev === 0 ? 0 : prev - 1));
    console.log("sliderIdx ->", sliderIdx);
  };

  const sliderVariants = {
    entry: (back) => ({
      opacity: 0,
      scale: 1,
      x: back ? -window.outerWidth - 50 : window.outerWidth + 50,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: (back) => ({
      opacity: 0,
      scale: 1,
      x: back ? window.outerWidth + 50 : -window.outerWidth - 50,
      transition: {
        duration: 0.3,
      },
    }),
  };

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <section className="rsv-most" title="예약이 가장 많은 캠핑장">
      <div className="rsv-most-header">
        <h3>오늘의 픽텐트!</h3>
        <h2>예약이 가장 많은 캠핑장</h2>
      </div>
      <div>
        <AnimatePresence mode="popLayout" custom={back} initial={false}>
          <motion.ul className="rsv-most__list-wrapper" key={sliderIdx}>
            {data
              .slice(offset * sliderIdx, offset * sliderIdx + offset)
              .map((campObj, idx) => {
                return (
                  <motion.li
                    key={idx}
                    custom={back}
                    variants={sliderVariants}
                    initial="entry"
                    animate="center"
                    exit="exit"
                    whileHover={{ scale: 1.1, duration: 0.2 }}
                    transition={{ type: "tween", duration: 0.2 }}
                  >
                    <ProductMain camp={campObj} />
                  </motion.li>
                );
              })}
          </motion.ul>
          {/* <div>{visible}</div> */}
        </AnimatePresence>
      </div>
      <div className="rsv-most__buttons">
        <Button onClick={prevBtn}>← Prev</Button>
        <Button onClick={nextBtn}>Next →</Button>
      </div>
    </section>
  );
}
