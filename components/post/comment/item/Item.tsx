'use client';

import { useEffect, useContext } from 'react';
import Info from './Info';
import Recomment from './Recomment';
import { CommentContext, CommentProvider } from '@context/Comment';
import Content from './Content';

export default function Item() {
  const {
    id,
    parentId,
    emoticons,
    comments,
    mutate,
    setUp,
    mode,
    setMode,
    isRecommentExpanded,
    setIsRecommentExpanded,
    onClickCancel,
  } = useContext(CommentContext);

  useEffect(() => {
    setUp(emoticons);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className='p-2 flex flex-col border border-lime-500'>
        <Info />
        <Content />
      </div>
      {comments && comments.length > 0 && (
        <div className='p-2 border'>
          {isRecommentExpanded ? (
            <div className='flex flex-col justify-between'>
              {comments.map((comment) => {
                return (
                  <CommentProvider
                    key={comment.id}
                    initialValue={{ ...comment, mutate }}
                  >
                    <Item />
                  </CommentProvider>
                );
              })}
              <button onClick={() => setIsRecommentExpanded(false)}>
                접기
              </button>
            </div>
          ) : (
            <button onClick={() => setIsRecommentExpanded(true)}>
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
