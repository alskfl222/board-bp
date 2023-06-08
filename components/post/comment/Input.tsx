import { useState, useContext } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import EmoticonContainer from './emoticon/Container';
import { getFetchUrl, exceptionHandler } from '@util';
import { EmoticonContext } from '@context/Emoticon';

export default function Input({ mutate }: { mutate: KeyedMutator<any> }) {
  const pathname = usePathname();
  const { selected, remove, cleanUp } = useContext(EmoticonContext);
  const [comment, setComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onSubmit = async () => {
    try {
      await axios.post(fetchUrl, {
        content: comment,
        emoticons: selected,
      });
      cleanUp();
      await mutate();
    } catch (err: any) {
      exceptionHandler(err);
    }
  };

  return (
    <div className='p-2 flex flex-col gap-2 border border-lime-500'>
      <EmoticonContainer
        selected={selected}
        remove={remove}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <input
        className='text-black'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={onSubmit}>댓글 쓰기</button>
    </div>
  );
}
