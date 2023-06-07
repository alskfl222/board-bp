import { create } from 'zustand';

export interface Item {
  id: number;
  kind: string;
  path: string;
  name: string;
  listId: number;
}

interface Emoticon {
  selected: Item[];
  isExist: (item: Item) => boolean;
  add: (item: Item) => void;
  remove: (item: Item) => void;
}

export const useEmoticonStore = create<Emoticon>((set, get) => ({
  selected: [],
  isExist(item) {
    const exist = get().selected.find((exist) => exist.id === item.id);
    return exist ? true : false;
  },
  add(item) {
    set((state) => {
      return { ...state, selected: [...get().selected, item] };
    });
  },
  remove(item) {
    set((state) => {
      const removed = get().selected.filter((exist) => exist.id !== item.id);
      return { ...state, selected: removed };
    });
  },
}));
