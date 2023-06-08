import { Dispatch, SetStateAction } from 'react';
import List from './List';
import Selected from './Selected';

export default function Container({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
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
      <Selected />
    </div>
  );
}
