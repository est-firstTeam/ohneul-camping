import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      id: "",
      name: "",
      email: "",
      profileImg: "",
      isLoggedIn: false,
      carts: [],
      setUser: (userInfo) => {
        set(() => {
          return {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            profileImg: "",
            isLoggedIn: true,
          };
        });
      },
      setUserLoggedIn: (loginFlag) => set(() => ({ isLoggedIn: loginFlag })),
      setCarts: (cart) => set((state) => ({ carts: [...state.carts, cart] })),
    }),
    {
      name: "storage-user",
    }
  )
);
