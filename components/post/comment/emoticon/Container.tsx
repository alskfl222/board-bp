import { Dispatch, SetStateAction } from 'react';
import List from './List';
import Selected from './Selected';
import { EmoticonItem } from '@context/Emoticon';

export default function Container({
  isExpanded,
  setIsExpanded,
  selected,
  remove,
}: {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  selected: any[];
  remove: (item: EmoticonItem) => void;
}) {
  return (
    <div>
      {isExpanded ? (
        <div>
          <List />
          <button onClick={() => setIsExpanded(false)}>접기</button>
        </div>
      ) : (
        <button onClick={() => setIsExpanded(true)}>이모티콘</button>
      )}
      <Selected selected={selected} remove={remove} />
    </div>
  );
}
