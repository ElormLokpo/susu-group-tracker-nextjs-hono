import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({
          user,
          token,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
