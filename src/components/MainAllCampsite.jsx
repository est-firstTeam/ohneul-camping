import { useQuery } from "@tanstack/react-query";
import { fBService } from "../util/fbService";
import ProductMain from "./ProductCard";
import { motion, useMotionValueEvent, useScroll } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useEffect, useState } from "react";

export default function MainAllCampsite() {
  const { data, status, error } = useQuery({
    queryKey: ["campsites"],
    queryFn: async () => fBService.getAllCampsites(),
  });
  const { scrollYProgress } = useScroll();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const loadItems = () => {
    var newItems = data.slice(0, Math.min(items.length + 3, data.length));
    setItems(newItems);
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
    <section className="all-campsite" title="예약이 가장 많은 캠핑장">
      <div className="all-campsite__header">
        <h3>오늘 어디 갈래?</h3>
        <h2>모든 캠핑장 정보</h2>
      </div>
      <div>
        <ul className="all-campsite__wrapper">
          {items.map((campObj) => {
            return (
              <motion.li
                className="all-campsite__item"
                key={campObj.id}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -30 }}
                transition={{ duration: 0.5, type: "spring", delay: 0 }}
                whileHover={{ scale: 1.1, delay: 0 }}
                onClick={() => {
                  console.log("clicked!!");
                }}
              >
                <ProductMain camp={campObj} />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
