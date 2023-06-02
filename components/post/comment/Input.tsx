import { useState } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import { getFetchUrl, exceptionHandler } from '@util';
import EmoticonList from '@comp/post/comment/emoticon/List';

export default function Input({ mutate }: { mutate: KeyedMutator<any> }) {
  const pathname = usePathname();
  const [comment, setComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onSubmit = async () => {
    try {
      await axios.post(fetchUrl, {
        content: comment,
      });
      await mutate();
    } catch (err: any) {
      exceptionHandler(err);
    }
  };

  return (
    <div className='p-2 flex flex-col border border-lime-500'>
      {isExpanded ? (
        <div>
          <EmoticonList />
          <button onClick={() => setIsExpanded(false)}>접기</button>
        </div>
      ) : (
        <button onClick={() => setIsExpanded(true)}>이모티콘</button>
      )}
      <input
        className='text-black'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={onSubmit}>댓글 쓰기</button>
    </div>
  );
}
