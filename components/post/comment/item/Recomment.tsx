import { useState, Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getFetchUrl } from '@util/fetch';
import { KeyedMutator } from 'swr';

export function Recomment({
  id,
  parentId,
  setMode,
  onClickCancel,
  mutate,
}: {
  id: number;
  parentId: number | null;
  setMode: Dispatch<SetStateAction<'recomment' | 'modify' | 'read'>>;
  onClickCancel: () => void;
  mutate: KeyedMutator<any>;
}) {
  const pathname = usePathname();
  const [recomment, setRecomment] = useState('');
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onSubmitRecomment = async () => {
    try {
      await axios.post(fetchUrl, {
        parentId: parentId ?? id,
        content: recomment,
      });
      await mutate();
      setMode('read');
    } catch (err) {}
  };

  return (
    <div className='w-full flex justify-between'>
      <input
        className='text-black'
        value={recomment}
        onChange={(e) => setRecomment(e.target.value)}
      />
      <div>
        <button onClick={onSubmitRecomment}>확인</button>
        <button onClick={onClickCancel}>취소</button>
      </div>
    </div>
  );
}
