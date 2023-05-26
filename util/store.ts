import { create } from 'zustand';

interface Store {
  isLogin: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const useStore = create<Store>((set) => ({
  isLogin: JSON.parse(localStorage.getItem('isLogin') || 'false'),
  signIn: () =>
    set((state) => {
      localStorage.setItem('isLogin', 'true');
      return { ...state, isLogin: true };
    }),
  signOut: () =>
    set((state) => {
      localStorage.setItem('isLogin', 'false');
      return { ...state, isLogin: false };
    }),
}));
