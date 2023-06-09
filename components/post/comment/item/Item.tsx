'use client';

import { useEffect, useContext } from 'react';
import Info from './Info';
import Content from './Content';
import Recomment from './Recomment';
import { CommentContext, CommentProvider } from '@context/Comment';

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
    recommentTo,
    isRecommentExpanded,
    setIsRecommentExpanded,
    pathname,
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
        <CommentProvider
          initialValue={{
            id,
            parentId,
            pathname,
            mutate,
            onClickCancel,
            modeState: [mode, setMode],
            recommentTo,
          }}
        >
          <Recomment />
        </CommentProvider>
      )}
    </div>
  );
}
