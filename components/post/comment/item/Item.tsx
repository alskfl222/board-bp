'use client';

import { useState, useRef } from 'react';
import { KeyedMutator } from 'swr';
import Info from './Info';
import Recomment from './Recomment';
import type { Comment } from '../Container';

export default function Item(comment: Comment & { mutate: KeyedMutator<any> }) {
  const { id, parentId, content: prevContent, comments, mutate } = comment;
  const content = useRef(prevContent);
  const [mode, setMode] = useState<'read' | 'modify' | 'recomment'>('read');
  const [inputText, setInputText] = useState(prevContent);
  const [isExpanded, setIsExpanded] = useState(false);

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
                return <Item key={comment.id} {...comment} mutate={mutate} />;
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
