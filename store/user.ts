import axios from 'axios';
import { create } from 'zustand';
import { getFetchUrl } from '@util';

interface Store {
  isLogin: boolean;
  userId: number;
  signIn: (id: number) => void;
  signOut: () => void;
  validate: () => Promise<void>;
}

export const useUserStore = create<Store>((set, get) => ({
  isLogin:
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('isLogin') || 'false')
      : false,
  userId:
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('userId') || '-1')
      : -1,
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
  async validate() {
    const fetchUrl = getFetchUrl('/auth/validate');
    try {
      await axios.get(fetchUrl);
    } catch {
      get().signOut();
    }
  },
}));
