import { create } from "zustand";

const useSiteStore = create((set) => ({
  siteCounts: [0, 0, 0, 0],
  rsvTotalPrice: 0,

  setSiteCounts: (newCounts) =>
    set({ siteCounts: Array.isArray(newCounts) ? newCounts : [0, 0, 0, 0] }),

  resetSiteCounts: () => set({ siteCounts: [0, 0, 0, 0] }),

}));

export default useSiteStore;