import { useQuery } from "@tanstack/react-query";
import ProductList from "./ProductList";
import { fBService } from "../util/fbService";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import ProductMain from "./ProductCard";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const SLIDER_MAX_IDX = 9;
const OFFSET = 3;

export default function MainMostRSV() {
  const navi = useNavigate();
  const [sliderIdx, setSliderIdx] = useState(0);
  const canScrollPrev = sliderIdx > 0;
  const canScrollNext = sliderIdx < SLIDER_MAX_IDX;
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
    // const maxIdx = Math.floor(data.length / offset);
    const maxIdx = data.length;
    setSliderIdx((prev) => (prev === maxIdx ? maxIdx : prev + 1));
  };
  const prevBtn = () => {
    setBack(true);
    setSliderIdx((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const sliderVariants = {
    entry: (back) => {
      console.log("Entry!");
      return {
        opacity: 0,
        x: back ? -370 : 370,
      };
    },
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: (back) => {
      console.log("Exit!");
      return {
        opacity: 0,
        x: back ? 370 : -370,
        transition: {
          type: "tween",
        },
      };
    },
  };

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <section className="rsv-most">
      <h2>오늘의 픽텐트!</h2>
      <h3>예약이 가장 많은 캠핑장</h3>
      <AnimatePresence mode="popLayout" custom={back} initial={false}>
        <motion.ul
          className="rsv-most__list-wrapper"
          key={sliderIdx}
          custom={back}
          variants={sliderVariants}
          initial="entry"
          animate="center"
          exit="exit"
        >
          {data.slice(sliderIdx, sliderIdx + OFFSET).map((campObj, idx) => {
            return (
              <motion.li
                onClick={() => navi(`/searchResult/${campObj.id}`)}
                key={idx}
                whileHover={{ scale: 1.05, duration: 0.2 }}
              >
                <ProductMain camp={campObj} />
              </motion.li>
            );
          })}
        </motion.ul>
      </AnimatePresence>
      <div className="rsv-most__buttons">
        <Button onClick={prevBtn} disabled={!canScrollPrev}>
          ← Prev
        </Button>
        <Button onClick={nextBtn} disabled={!canScrollNext}>
          Next →
        </Button>
      </div>
    </section>
  );
}
