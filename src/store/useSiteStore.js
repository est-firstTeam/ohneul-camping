// import { doc, setDoc } from "firebase/firestore";
import { create } from "zustand";
// import { firebaseDB } from "../firebaseConfig";

const useSiteStore = create((set) => ({
  siteCounts: [0, 0, 0, 0],
  rsvTotalPrice: 0,

  setSiteCounts: (newCounts) =>
    set({ siteCounts: Array.isArray(newCounts) ? newCounts : [0, 0, 0, 0] }),

  setRsvTotalPrice: (price) => set({ rsvTotalPrice: price }),

  resetSiteCounts: () => set({ siteCounts: [0, 0, 0, 0] }),

  // updateTotalPriceInFirestore: async (price) => {
  //   try {
  //     const userRef = doc(firebaseDB, "User", "KvsuGtPyBORD2OHATEwpvthlQKt1");
  //     await setDoc(userRef, { rsvTotalPrice: price }, { merge: true });
  //     console.log("업데이트 완료");
  //   } catch (error) {
  //     console.error("업데이트 실패", error);
  //   }
  // },
}));

export default useSiteStore;