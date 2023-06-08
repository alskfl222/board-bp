import React, { useState, useEffect } from 'react';

export interface EmoticonItem {
  id: number;
  kind: string;
  path: string;
  name: string;
  listId: number;
}

interface EmoticonHook {
  selected: EmoticonItem[];
  isExist: (item: EmoticonItem) => boolean;
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

  function add(item: EmoticonItem) {
    setSelected((state) => [...selected, item]);
  }
  function remove(item: EmoticonItem) {
    setSelected((state) => selected.filter((exist) => exist.id !== item.id));
  }
  function cleanUp() {
    setSelected((state) => []);
  }

  return { selected, isExist, add, remove, cleanUp };
};

export const EmoticonContext = React.createContext<EmoticonHook>({
  selected: [],
  isExist: (item: EmoticonItem) => true,
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
