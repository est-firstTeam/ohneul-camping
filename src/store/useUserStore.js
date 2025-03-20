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

  setUser: (userInfo) => {
    set(() => {
      return {
        id: userInfo.Id,
        name: userInfo.Name,
        email: userInfo.Email,
        isLoggedIn: true,
      };
    });
  },
  setUserLoggedIn: (loginFlag) => set(() => ({ isLoggedIn: loginFlag })),
  setUserBooking: (user) => set(() => ({ userBooking: [...user.userBooking] })),
  setUserBasket: (user) => set(() => ({ userBasket: [...user.userBasket] })),
}));
