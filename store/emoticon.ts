import { create } from 'zustand';

export interface EmoticonItem {
  id: number;
  kind: string;
  path: string;
  name: string;
  listId: number;
}

interface Emoticon {
  selected: EmoticonItem[];
  isExist: (item: EmoticonItem) => boolean;
  add: (item: EmoticonItem) => void;
  remove: (item: EmoticonItem) => void;
  cleanUp: () => void;
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
  cleanUp() {
    set((state) => {
      return { ...state, selected: [] };
    });
  },
}));
