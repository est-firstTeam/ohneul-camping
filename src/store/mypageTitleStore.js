import { create } from "zustand";

const myPageTitleStore = create((set) => ({
  title: "",
  setTitle: (newTitle) => set({ title: newTitle }),
  // TODO: page에 따라 set되게 만들고싶음
}));
export default myPageTitleStore;
