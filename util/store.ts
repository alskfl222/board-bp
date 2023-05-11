import { create } from 'zustand';

interface Store {
  isLogin: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const useStore = create<Store>((set) => ({
  isLogin: false,
  signIn: () => set((state) => ({ isLogin: true })),
  signOut: () => set({ isLogin: false }),
}));
