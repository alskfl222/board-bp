'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getFetchUrl } from '@util/fetch';
import { Read, Modify, Recomment } from './Button';
import type { Comment } from './Container';

export default function Item(comment: Comment) {
  const {
    id,
    parentId,
    author,
    authorId,
    content: prevContent,
    createdAt,
    comments,
    fetchData,
  } = comment;
  const pathname = usePathname();
  const content = useRef(prevContent);
  const [mode, setMode] = useState<'read' | 'modify' | 'recomment'>('read');
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState(prevContent);
  const [recomment, setRecomment] = useState('');
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onSubmit = async () => {
    if (content.current === inputText) {
      setMode('read');
      return;
    }
    try {
      const res = await axios.put(fetchUrl, {
        id,
        content: inputText,
      });
      content.current = res.data.content;
      setInputText(res.data.content);
      setMode('read');
    } catch (err) {
      console.log(err);
    }
  };

  const onClickDelete = async () => {
    try {
      await axios.delete(`${fetchUrl}/${id}`);
      await fetchData();
      setMode('read');
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitRecomment = async () => {
    try {
      await axios.post(fetchUrl, {
        parentId: parentId ?? id,
        content: recomment,
      });
      await fetchData();
      setMode('read');
    } catch (err) {
      console.log(err);
    }
  };

  const onClickCancel = () => {
    setInputText(content.current);
    setMode('read');
  };

  const createButton = (authorId: number) => {
    return {
      read: (
        <Read
          parentId={parentId}
          authorId={authorId}
          setMode={setMode}
          onClickDelete={onClickDelete}
        />
      ),
      modify: <Modify onSubmit={onSubmit} onClickCancel={onClickCancel} />,
      recomment: <span>...</span>,
    };
  };

  return (
    <>
      <div className='p-2 flex flex-col border border-lime-500'>
        <div className='w-full flex justify-between'>
          <div>{author}</div>
          <div>{createdAt}</div>
          <div>{createButton(authorId)[mode]}</div>
        </div>

        {mode !== 'modify' ? (
          <div>{content.current}</div>
        ) : (
          <input
            className='text-black'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        )}
      </div>
      {comments && comments.length > 0 && (
        <div className='p-2 border'>
          {isExpanded ? (
            <>
              {comments.map((comment) => {
                return (
                  <Item key={comment.id} {...comment} fetchData={fetchData} />
                );
              })}
              <button onClick={() => setIsExpanded(false)}>접기</button>
            </>
          ) : (
            <button onClick={() => setIsExpanded(true)}>
              대댓글 {comments.length}개
            </button>
          )}
        </div>
      )}
      {mode === 'recomment' && (
        <Recomment
          recomment={recomment}
          setRecomment={setRecomment}
          onSubmitRecomment={onSubmitRecomment}
          onClickCancel={onClickCancel}
        />
      )}
    </>
  );
}
