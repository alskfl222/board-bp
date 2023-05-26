import { create } from 'zustand';

interface Store {
  isLogin: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const useStore = create<Store>((set) => ({
  isLogin: JSON.parse(sessionStorage.getItem('isLogin') || 'false'),
  signIn: () =>
    set((state) => {
      sessionStorage.setItem('isLogin', 'true');
      return { ...state, isLogin: true };
    }),
  signOut: () =>
    set((state) => {
      sessionStorage.setItem('isLogin', 'false');
      return { ...state, isLogin: false };
    }),
}));
