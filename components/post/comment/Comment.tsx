'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getFetchUrl } from '@util/fetch';

export default function CommentItem(commentProps: any) {
  const { id, parentId, author, content: prevContent, createdAt } = commentProps;
  const pathname = usePathname();
  const [mode, setMode] = useState<'read' | 'modify'>('read');
  const content = useRef(prevContent);
  const [modified, setModified] = useState(prevContent);
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onSubmit = async () => {
    try {
      const res = await axios.put(fetchUrl, {
        id,
        content: modified,
      });
      content.current = res.data.content;
      setModified(res.data.content);
      setMode('read');
    } catch (err) {
      console.log(err);
    }
  };

  const onClickCancel = () => {
    setModified(content.current);
    setMode('read');
  };

  return (
    <div className='flex justify-between'>
      <div>{author}</div>
      {mode === 'read' ? (
        <div>{content.current}</div>
      ) : (
        <input
          className='text-black'
          value={modified}
          onChange={(e) => setModified(e.target.value)}
        />
      )}
      <div>{createdAt}</div>
      <div>
        {mode === 'read' ? (
          <button onClick={() => setMode('modify')}>수정</button>
        ) : (
          <>
            <button onClick={onSubmit}>확인</button>
            <button onClick={onClickCancel}>취소</button>
          </>
        )}
      </div>
    </div>
  );
}
