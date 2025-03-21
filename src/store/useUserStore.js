import { create } from "zustand";

const initialState = {
  id: "",
  name: "",
  email: "",
  profileImg: "",
  isLoggedIn: false,
  carts: [],
};

export const useUserStore = create((set) => ({
  ...initialState,

  setUser: (userInfo) => {
    set(() => {
      return {
        id: userInfo.Id,
        name: userInfo.Name,
        email: userInfo.Email,
        profileImg: "",
        isLoggedIn: true,
      };
    });
  },
  setUserLoggedIn: (loginFlag) => set(() => ({ isLoggedIn: loginFlag })),
  setCarts: (cart) => set((state) => ({ carts: [...state.carts, cart] })),
}));
