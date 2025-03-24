import { useQuery } from "@tanstack/react-query";
import { fBService } from "../util/fbService";
import ProductMain from "./ProductMain";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export default function MainAllCampsite() {
  const { data, isLoading } = useQuery({
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
    if (loading) {
      loadItems();
      setLoading(false);
    }
  }, [loading]);

  return isLoading ? (
    <div>Loading ... </div>
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
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -30 }}
                transition={{ duration: 1, type: "spring", delay: 0.2 }}
                key={campObj.id}
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
