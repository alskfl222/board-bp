import { create } from 'zustand';

interface Store {
  isLogin: boolean;
  userId: number;
  signIn: (id: number) => void;
  signOut: () => void;
}

export const useUserStore = create<Store>((set) => ({
  isLogin:
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('isLogin') || 'false')
      : false,
  userId: -1,
  signIn(id: number) {
    set((state) => {
      sessionStorage.setItem('isLogin', 'true');
      sessionStorage.setItem('userId', `${id}`);
      return { ...state, isLogin: true, userId: id };
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
