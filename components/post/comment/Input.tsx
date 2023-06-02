import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { getFetchUrl, exceptionHandler } from '@util';
import { KeyedMutator } from 'swr';

export default function Input({ mutate }: { mutate: KeyedMutator<any> }) {
  const router = useRouter();
  const pathname = usePathname();
  const [comment, setComment] = useState('');
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
    <div className='p-2 border border-lime-500'>
      <input
        className='text-black'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={onSubmit}>댓글 쓰기</button>
    </div>
  );
}
