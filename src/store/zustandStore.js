import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: {
    id: "",
    name: "",
    email: "",
    isLoggedIn: false,
    userBooking: [],
    userBasket: [],
  },
  setUser: (user) => {
    set(() => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    });
  },
  setUserLoggedIn: (loginFlag) => set(() => ({ isLoggedIn: loginFlag })),
  setUserBooking: (user) => set(() => ({ userBooking: [...user.userBooking] })),
  setUserBasket: (user) => set(() => ({ userBasket: [...user.userBasket] })),
}));
