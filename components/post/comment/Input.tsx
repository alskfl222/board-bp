'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getFetchUrl } from '@util/fetch';

export default function CommentInput() {
  const pathname = usePathname();
  const [comment, setComment] = useState('');
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onSubmit = async () => {
    try {
      await axios.post(fetchUrl, {
        content: comment,
      });
      window.location.href = window.location.href;
    } catch (err) {
      console.log(err);
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
