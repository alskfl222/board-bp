import axios from 'axios';

import { useContext } from 'react';
import { Read } from './Button';
import { CommentContext } from '@context/Comment';
import { exceptionHandler, getFetchUrl, toPrettyKST } from '@util';

export default function Info() {
  const {
    id,
    parentId,
    author,
    authorId,
    createdAt,
    mode,
    setMode,
    mutate,
    pathname,
  } = useContext(CommentContext);

  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onClickDelete = async () => {
    try {
      await axios.delete(`${fetchUrl}/${id}`);
      await mutate();
      setMode('read');
    } catch (err) {
      exceptionHandler(err);
    }
  };

  return (
    <div className='w-full flex justify-between'>
      <div>{author}</div>
      <div>
        <div>{toPrettyKST(createdAt)}</div>
        <div>
          {mode === 'read' ? (
            <Read
              parentId={parentId}
              authorId={authorId}
              setMode={setMode}
              onClickDelete={onClickDelete}
            />
          ) : (
            '...'
          )}
        </div>
      </div>
    </div>
  );
}
