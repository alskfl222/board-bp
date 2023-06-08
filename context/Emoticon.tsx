import { useState, createContext } from 'react';

export interface EmoticonItem {
  id: number;
  kind: string;
  path: string;
  name: string;
  listId: number;
}

export interface EmoticonHook {
  selected: EmoticonItem[];
  isExist: (item: EmoticonItem) => boolean;
  setUp: (items: EmoticonItem[]) => void;
  add: (item: EmoticonItem) => void;
  remove: (item: EmoticonItem) => void;
  cleanUp: () => void;
}

export const useEmoticon = (): EmoticonHook => {
  const [selected, setSelected] = useState<EmoticonItem[]>([]);

  function isExist(item: EmoticonItem) {
    const exist = selected.find((exist) => exist.id === item.id);
    return exist ? true : false;
  }
  function setUp(items: EmoticonItem[]) {
    setSelected((state) => [...items]);
  }

  function add(item: EmoticonItem) {
    if (selected.length < 3) setSelected((state) => [...selected, item]);
  }
  function remove(item: EmoticonItem) {
    setSelected((state) => selected.filter((exist) => exist.id !== item.id));
  }
  function cleanUp() {
    setSelected((state) => []);
  }

  return { selected, isExist, setUp, add, remove, cleanUp };
};

export const EmoticonContext = createContext<EmoticonHook>({
  selected: [],
  isExist: (item: EmoticonItem) => true,
  setUp: (items: EmoticonItem[]) => {},
  add: (item: EmoticonItem) => {},
  remove: (item: EmoticonItem) => {},
  cleanUp: () => {},
});

export function EmoticonProvider({ children }: any) {
  const value = useEmoticon();

  return (
    <EmoticonContext.Provider value={value}>
      {children}
    </EmoticonContext.Provider>
  );
}
