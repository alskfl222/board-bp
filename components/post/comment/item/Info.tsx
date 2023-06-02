import { MutableRefObject, Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import { getFetchUrl } from '@util/fetch';
import { Read } from './Button';
import type { Comment } from '../Container';

export default function Info(
  info: Omit<Comment, 'content'> & {
    content: MutableRefObject<string>;
    mode: 'read' | 'modify' | 'recomment';
    setMode: Dispatch<SetStateAction<'read' | 'modify' | 'recomment'>>;
    onClickCancel: () => void;
    mutate: KeyedMutator<any>;
  }
) {
  const {
    id,
    parentId,
    author,
    authorId,
    createdAt,
    mode,
    setMode,
    mutate,
  } = info;
  const pathname = usePathname();
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onClickDelete = async () => {
    try {
      await axios.delete(`${fetchUrl}/${id}`);
      await mutate();
      setMode('read');
    } catch (err) {}
  };

  return (
    <div className='w-full flex justify-between'>
      <div>{author}</div>
      <div>
        <div>{createdAt}</div>
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
