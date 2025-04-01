import { useQuery } from "@tanstack/react-query";
import { fBService } from "../util/fbService";
import ProductMain from "./ProductCard";
import { motion, useMotionValueEvent, useScroll } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSectionRefStore from "../store/useSectionRefStore";

export default function MainAllCampsite() {
  const { data, status, error } = useQuery({
    queryKey: ["campsites"],
    queryFn: async () => fBService.getAllCampsites(),
    staleTime: 300000,
  });
  const { reservation } = useSectionRefStore();
  const navi = useNavigate();
  const { scrollYProgress } = useScroll();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const loadItems = () => {
    if (loading) {
      var newItems = data.slice(0, Math.min(items.length + 3, data.length));
      setItems(newItems);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.95) setLoading(true);
  });

  useEffect(() => {
    if (status === "success") {
      loadItems();
      setLoading(false);
    }
  }, [status, loading]);

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <section className="all-campsite">
      <h2 className="section-header__subtitle">오늘 어디 갈래?</h2>
      <h3 className="section-header__title">모든 캠핑장 정보</h3>
      <ul className="all-campsite__wrapper" ref={reservation}>
        {items.map((campObj) => {
          return (
            <motion.li
              className="all-campsite__item"
              key={campObj.id}
              initial={{ opacity: 0, y: +30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "tween", delay: 0.1 }}
              whileHover={{
                scale: 1.05,
                cursor: "pointer",
                transition: {
                  duration: 0.2,
                },
              }}
              onClick={() => {
                navi(`/searchResult/${campObj.id}`);
              }}
            >
              <ProductMain camp={campObj} />
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
