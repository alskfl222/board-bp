'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import Info from './Info';
import EmoticonContainer from '../emoticon/Container';
import Recomment from './Recomment';
import { Modify } from './Button';
import { exceptionHandler, getFetchUrl } from '@util';
import type { Comment } from '../Container';
import { EmoticonContext } from '@hook/useEmoticon';

export default function Item(comment: Comment & { mutate: KeyedMutator<any> }) {
  const {
    id,
    parentId,
    content: prevContent,
    comments,
    emoticons,
    mutate,
  } = comment;
  const pathname = usePathname();
  const { selected, add, cleanUp } = useContext(EmoticonContext);
  const content = useRef(prevContent);
  const [mode, setMode] = useState<'read' | 'modify' | 'recomment'>('read');
  const [inputText, setInputText] = useState(prevContent);
  const [isEmoticonsExpanded, setIsEmoticonsExpanded] = useState(false);
  const [isRecommentExpanded, setIsRecommentExpanded] = useState(false);

  useEffect(() => {
    emoticons.forEach((emoticon) => {
      add(emoticon);
    });
  }, []);

  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const isValidModifyContent = (): boolean => {
    if (content.current !== inputText) return true;
    if (emoticons.length !== selected.length) return true;
    for (let i = 0; i < emoticons.length; i++) {
      if (emoticons[i].id !== selected[i].id) return true;
    }
    return false;
  };

  const onSubmitModify = async () => {
    if (!isValidModifyContent()) {
      setMode('read');
      return;
    }
    try {
      const res = await axios.put(fetchUrl, {
        id,
        content: inputText,
        emoticons: selected,
      });
      content.current = res.data.content;
      setInputText(res.data.content);
      setMode('read');
      await mutate();
    } catch (err) {
      exceptionHandler(err);
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
          <div>
            {emoticons.length > 0 && (
              <div className='flex gap-2'>
                {emoticons.map((emoticon, index) => {
                  return (
                    <div key={`${emoticon.id}_${index}`}>
                      <Image
                        src={`/emoticon/${emoticon.kind}/${emoticon.path}`}
                        alt={emoticon.name}
                        title={emoticon.name}
                        width={100}
                        height={100}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            <div>{content.current}</div>
          </div>
        ) : (
          <div>
            <EmoticonContainer
              isExpanded={isEmoticonsExpanded}
              setIsExpanded={setIsEmoticonsExpanded}
            />
            <div className='flex justify-between'>
              <input
                className='text-black'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Modify onSubmit={onSubmitModify} onClickCancel={onClickCancel} />
            </div>
          </div>
        )}
      </div>
      {comments && comments.length > 0 && (
        <div className='p-2 border'>
          {isRecommentExpanded ? (
            <div className='flex flex-col justify-between'>
              {comments.map((comment) => {
                return <Item key={comment.id} {...comment} mutate={mutate} />;
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
