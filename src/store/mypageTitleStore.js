import { create } from "zustand";

const myPageTitleStore = create((set) => ({
  title: "",
  setTitle: (newTitle) => set({ title: newTitle }),
}));
export default myPageTitleStore;
