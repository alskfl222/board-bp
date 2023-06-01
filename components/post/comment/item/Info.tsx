import { MutableRefObject, Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import { getFetchUrl } from '@util/fetch';
import { Read, Modify } from './Button';
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
    content,
    mode,
    setMode,
    onClickCancel,
    mutate,
  } = info;
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
      console.log(err);
    }
  };

  const onClickDelete = async () => {
    try {
      await axios.delete(`${fetchUrl}/${id}`);
      await mutate();
      setMode('read');
    } catch (err) {}
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
      modify: (
        <Modify onSubmit={onSubmitModify} onClickCancel={onClickCancel} />
      ),
      recomment: <span>...</span>,
    };
  };
  return (
    <div className='w-full flex justify-between'>
      <div>{author}</div>
      <div>
        <div>{createdAt}</div>
        <div>{createButton(authorId)[mode]}</div>
      </div>
    </div>
  );
}
