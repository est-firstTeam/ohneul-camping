import { useQuery } from "@tanstack/react-query";
import ProductList from "./ProductList";
import { fBService } from "../util/fbService";
import {
  AnimatePresence,
  MotionConfig,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import ProductMain from "./ProductCard";
import Button from "./Button";

const START_INDEX = 1;
const DRAG_THRESHOLD = 150;
const FALLBACK_WIDTH = 509;

export default function Test() {
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
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const offset = 3;
  const [sliderIdx, setSliderIdx] = useState(0);
  const [back, setBack] = useState(false);

  const [startIdx, setStartIdx] = useState(1);
  const [endIdx, setEndIdx] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSlide, setActiveSlide] = useState(START_INDEX);
  const canScrollPrev = activeSlide > 0;
  const canScrollNext = activeSlide < 10 - 1;
  const offsetX = useMotionValue(0);
  const animatedX = useSpring(offsetX, {
    damping: 20,
    stiffness: 150,
  });

  function handleDragSnap(_, { offset: { x: dragOffset } }) {
    //reset drag state
    setIsDragging(false);
    containerRef.current?.removeAttribute("data-dragging");

    //stop drag animation (rest velocity)
    animatedX.stop();

    const currentOffset = offsetX.get();

    //snap back if not dragged far enough or if at the start/end of the list
    if (
      Math.abs(dragOffset) < DRAG_THRESHOLD ||
      (!canScrollPrev && dragOffset > 0) ||
      (!canScrollNext && dragOffset < 0)
    ) {
      animatedX.set(currentOffset);
      return;
    }

    let offsetWidth = 0;
    /*
      - start searching from currently active slide in the direction of the drag
      - check if the drag offset is greater than the width of the current item
      - if it is, add/subtract the width of the next/prev item to the offsetWidth
      - if it isn't, snap to the next/prev item
    */
    for (
      let i = activeSlide;
      dragOffset > 0 ? i >= 0 : i < itemsRef.current.length;
      dragOffset > 0 ? i-- : i++
    ) {
      const item = itemsRef.current[i];
      if (item === null) continue;
      const itemOffset = item.offsetWidth;

      const prevItemWidth =
        itemsRef.current[i - 1]?.offsetWidth ?? FALLBACK_WIDTH;
      const nextItemWidth =
        itemsRef.current[i + 1]?.offsetWidth ?? FALLBACK_WIDTH;

      if (
        (dragOffset > 0 && //dragging left
          dragOffset > offsetWidth + itemOffset && //dragged past item
          i > 1) || //not the first/second item
        (dragOffset < 0 && //dragging right
          dragOffset < offsetWidth + -itemOffset && //dragged past item
          i < itemsRef.current.length - 2) //not the last/second to last item
      ) {
        dragOffset > 0
          ? (offsetWidth += prevItemWidth)
          : (offsetWidth -= nextItemWidth);
        continue;
      }

      if (dragOffset > 0) {
        //prev
        offsetX.set(currentOffset + offsetWidth + prevItemWidth);
        setActiveSlide(i - 1);
      } else {
        //next
        offsetX.set(currentOffset + offsetWidth - nextItemWidth);
        setActiveSlide(i + 1);
      }
      break;
    }
  }

  function scrollPrev() {
    //prevent scrolling past first item
    if (!canScrollPrev) return;

    const nextWidth = itemsRef.current
      .at(activeSlide - 1)
      ?.getBoundingClientRect().width;
    if (nextWidth === undefined) return;
    offsetX.set(offsetX.get() + nextWidth);

    setStartIdx((prev) => prev - 1);
    setEndIdx((prev) => prev - 1);
    setActiveSlide((prev) => prev - 1);
  }
  function scrollNext() {
    // prevent scrolling past last item
    if (!canScrollNext) return;

    const nextWidth = itemsRef.current
      .at(activeSlide + 1)
      ?.getBoundingClientRect().width;
    if (nextWidth === undefined) return;
    offsetX.set(offsetX.get() - nextWidth);

    setStartIdx((prev) => prev + 1);
    setEndIdx((prev) => prev + 1);
    setActiveSlide((prev) => prev + 1);
  }

  const nextBtn = () => {
    setBack(false);
    const maxIdx = Math.floor(data.length / offset);
    setSliderIdx((prev) => (prev === maxIdx ? maxIdx : prev + 1));
  };
  const prevBtn = () => {
    setBack(true);
    setSliderIdx((prev) => (prev === 0 ? 0 : prev - 1));
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
          <motion.ul
            className="rsv-most__list-wrapper"
            ref={containerRef}
            key={sliderIdx}
            style={{
              x: animatedX,
            }}
            drag="x"
            dragConstraints={{
              left: -(FALLBACK_WIDTH * (data.length - 1)),
              right: FALLBACK_WIDTH,
            }}
            onDragStart={() => {
              containerRef.current?.setAttribute("data-dragging", "true");
              setIsDragging(true);
            }}
            onDragEnd={handleDragSnap}
          >
            {data
              // .slice(offset * sliderIdx, offset * sliderIdx + offset)
              .slice(startIdx, endIdx)
              .map((campObj, idx) => {
                return (
                  <motion.li
                    key={data.id}
                    ref={(el) => (itemsRef.current[idx] = el)}
                    layout
                    transition={{
                      ease: "easeInOut",
                      duration: 0.4,
                    }}
                    style={{
                      flexBasis: "40%",
                    }}
                  >
                    <ProductMain camp={campObj} />
                  </motion.li>
                );
              })}
          </motion.ul>
        </AnimatePresence>
      </div>
      <div className="rsv-most__buttons">
        <Button onClick={scrollPrev} disabled={!canScrollPrev}>
          ← Prev
        </Button>
        <Button onClick={scrollNext} disabled={!canScrollNext}>
          Next →
        </Button>
      </div>
    </section>
  );
}
