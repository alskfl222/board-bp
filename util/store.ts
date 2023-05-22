import { create } from 'zustand';

interface Store {
  isLogin: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const useStore = create<Store>((set) => ({
  isLogin: false,
  signIn: () => set({ isLogin: true }),
  signOut: () => set({ isLogin: false }),
}));
