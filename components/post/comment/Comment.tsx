'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getFetchUrl } from '@util/fetch';
import type { Comment } from './Viewer';

export default function CommentItem(commentProps: Comment) {
  const {
    id,
    parentId,
    author,
    content: prevContent,
    createdAt,
    comments: prevComments,
  } = commentProps;
  const pathname = usePathname();
  const content = useRef(prevContent);
  const [mode, setMode] = useState<'read' | 'modify' | 'recomment'>('read');
  const [modified, setModified] = useState(prevContent);
  const [comments, setComments] = useState(prevComments);
  const [recomment, setRecomment] = useState('');
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

  const onSubmitRecomment = async () => {
    try {
      const res = await axios.post(fetchUrl, {
        parentId: parentId ?? id,
        content: recomment,
      });
      setComments((comments) => [...comments, res.data]);
      setMode('read');
    } catch (err) {
      console.log(err);
    }
  };

  const onClickCancel = () => {
    setModified(content.current);
    setMode('read');
  };

  const buttons = {
    read: (
      <>
        <button onClick={() => setMode('recomment')}>대댓글</button>
        <button onClick={() => setMode('modify')}>수정</button>
      </>
    ),
    modify: (
      <>
        <button onClick={onSubmit}>확인</button>
        <button onClick={onClickCancel}>취소</button>
      </>
    ),
    recomment: <span>대댓글</span>,
  };

  console.log(comments);

  return (
    <>
      <div className='flex justify-between'>
        <div>{author}</div>
        {mode !== 'modify' ? (
          <div>{content.current}</div>
        ) : (
          <input
            className='text-black'
            value={modified}
            onChange={(e) => setModified(e.target.value)}
          />
        )}
        <div>{createdAt}</div>
        <div>{buttons[mode]}</div>
      </div>
      {comments && comments.length > 0 && (
        <div className='p-2 border'>
          {comments.map((comment) => {
            return <CommentItem key={comment.id} {...comment} />;
          })}
        </div>
      )}
      {mode === 'recomment' && (
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
      )}
    </>
  );
}
