import { create } from 'zustand';

interface Store {
  isLogin: boolean;
  userId: number;
  signIn: (id: number) => void;
  signOut: () => void;
}

export const useStore = create<Store>((set) => ({
  isLogin: JSON.parse(sessionStorage.getItem('isLogin') || 'false'),
  userId: -1,
  signIn(id: number) {
    set((state) => {
      sessionStorage.setItem('isLogin', 'true');
      sessionStorage.setItem('userId', `${id}`);
      return { ...state, isLogin: true };
    });
  },
  signOut() {
    set((state) => {
      sessionStorage.setItem('isLogin', 'false');
      sessionStorage.setItem('userId', '-1');
      return { ...state, isLogin: false, userId: -1 };
    });
  },
}));
