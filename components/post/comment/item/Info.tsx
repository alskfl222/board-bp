import axios from 'axios';

import { useContext } from 'react';
import { Read } from './Button';
import { CommentContext } from '@context/Comment';
import { exceptionHandler, getFetchUrl, toDateString } from '@util';

export default function Info() {
  const { id, author, createdAt, mode, setMode, mutate, pathname } =
    useContext(CommentContext);

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
    <div className='w-full p-2 flex justify-between border border-lime-700'>
      <div className='flex gap-2'>
        <div>{author}</div>/<div>{toDateString(createdAt)}</div>
      </div>
      <div>
        <div>
          {mode === 'read' ? <Read onClickDelete={onClickDelete} /> : '...'}
        </div>
      </div>
    </div>
  );
}
