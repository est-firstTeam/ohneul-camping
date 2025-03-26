import { useQuery } from "@tanstack/react-query";
import ProductList from "./ProductList";
import { fBService } from "../util/fbService";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useRef, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import ProductMain from "./ProductCard";
import Button from "./Button";

export default function MainMostRSV() {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const offset = 3;
  const [sliderIdx, setSliderIdx] = useState(0);
  const canScrollPrev = sliderIdx > 0;
  const canScrollNext = sliderIdx < 9;
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
        scale: 1,
        x: back ? window.outerWidth + 50 : -window.outerWidth - 50,
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
        scale: 1,
        x: back ? -window.outerWidth - 50 : window.outerWidth + 50,
      };
    },
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
        <motion.ul
          className="rsv-most__list-wrapper"
          ref={containerRef}
          // key={sliderIdx}
        >
          <AnimatePresence mode="popLayout" custom={back} initial={false}>
            {data
              .slice(sliderIdx, sliderIdx + offset)
              // .slice(offset * sliderIdx, offset * sliderIdx + offset)
              .map((campObj, idx) => {
                return (
                  <motion.li
                    key={idx}
                    ref={(el) => (itemsRef.current[idx] = el)}
                    custom={back}
                    variants={sliderVariants}
                    initial="entry"
                    animate="center"
                    exit="exit"
                    whileHover={{ scale: 1.1, duration: 0.2 }}
                    // transition={{ type: "spring", duration: 0.2 }}
                  >
                    <ProductMain camp={campObj} />
                  </motion.li>
                );
              })}
          </AnimatePresence>
        </motion.ul>
      </div>
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
