import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    // local storage에 저장됨
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
            profileImg: userInfo.profileImg,
            isLoggedIn: true,
          };
        });
      },
      setUserLoggedIn: (loginFlag) => set(() => ({ isLoggedIn: loginFlag })),
      setCarts: (cart) => set((state) => ({ carts: [...state.carts, cart] })),
      resetUser: () => {
        set(() => ({
          id: "",
          name: "",
          email: "",
          profileImg: "",
          isLoggedIn: false,
          carts: [],
        }));
      },
    }),
    {
      name: "storage-user",
    }
  )
);
