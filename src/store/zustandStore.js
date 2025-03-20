import { create } from "zustand";

const initialState = {
  id: "",
  name: "",
  email: "",
  isLoggedIn: false,
  userBooking: [],
  userBasket: [],
};

export const useUserStore = create((set) => ({
  ...initialState,

  setUser: (user) => {
    set(() => {
      return {
        id: user.Id,
        name: user.Name,
        email: user.Email,
        isLoggedIn: true,
      };
    });
  },
  setUserLoggedIn: (loginFlag) => set(() => ({ isLoggedIn: loginFlag })),
  setUserBooking: (user) => set(() => ({ userBooking: [...user.userBooking] })),
  setUserBasket: (user) => set(() => ({ userBasket: [...user.userBasket] })),
}));
