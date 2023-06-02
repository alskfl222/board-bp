'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import Info from './Info';
import Recomment from './Recomment';
import { Modify } from './Button';
import { exceptionHandler, getFetchUrl } from '@util';
import type { Comment } from '../Container';

export default function Item(comment: Comment & { mutate: KeyedMutator<any> }) {
  const { id, parentId, content: prevContent, comments, mutate } = comment;
  const content = useRef(prevContent);
  const [mode, setMode] = useState<'read' | 'modify' | 'recomment'>('read');
  const [inputText, setInputText] = useState(prevContent);
  const [isExpanded, setIsExpanded] = useState(false);

  const pathname = usePathname();
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onSubmitModify = async () => {
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
      exceptionHandler(err)
    }
  };

  const onClickCancel = () => {
    setInputText(content.current);
    setMode('read');
  };

  return (
    <div>
      <div className='p-2 flex flex-col border border-lime-500'>
        <Info
          {...comment}
          mode={mode}
          content={content}
          setMode={setMode}
          onClickCancel={onClickCancel}
        />
        {mode !== 'modify' ? (
          <div>{content.current}</div>
        ) : (
          <div className='flex justify-between'>
            <input
              className='text-black'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Modify onSubmit={onSubmitModify} onClickCancel={onClickCancel} />
          </div>
        )}
      </div>
      {comments && comments.length > 0 && (
        <div className='p-2 border'>
          {isExpanded ? (
            <div className='flex flex-col justify-between'>
              {comments.map((comment) => {
                return <Item key={comment.id} {...comment} mutate={mutate} />;
              })}
              <button onClick={() => setIsExpanded(false)}>접기</button>
            </div>
          ) : (
            <button onClick={() => setIsExpanded(true)}>
              대댓글 {comments.length}개
            </button>
          )}
        </div>
      )}
      {mode === 'recomment' && (
        <Recomment
          id={id}
          parentId={parentId}
          setMode={setMode}
          onClickCancel={onClickCancel}
          mutate={mutate}
        />
      )}
    </div>
  );
}
