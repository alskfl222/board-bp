import { useState, useContext } from 'react';
import axios from 'axios';
import EmoticonContainer from '../emoticon/Container';
import { exceptionHandler, getFetchUrl } from '@util';
import { CommentContext } from '@context/Comment';

export default function Recomment() {
  const {
    id,
    parentId,
    pathname,
    mutate,
    selected,
    remove,
    setMode,
    recommentTo,
    isEmoticonsExpanded,
    setIsEmoticonsExpanded,
    onClickCancel,
  } = useContext(CommentContext);
  const [recomment, setRecomment] = useState(`@${recommentTo} `);
  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onSubmitRecomment = async () => {
    try {
      await axios.post(fetchUrl, {
        parentId: parentId ?? id,
        content: recomment,
        emoticons: selected,
      });
      await mutate();
      setMode('read');
    } catch (err) {
      exceptionHandler(err);
    }
  };

  return (
    <div className='w-full p-2 flex flex-col justify-between border'>
      <EmoticonContainer
        selected={selected}
        remove={remove}
        isExpanded={isEmoticonsExpanded}
        setIsExpanded={setIsEmoticonsExpanded}
      />
      <input
        className='text-black'
        value={recomment}
        onChange={(e) => setRecomment(e.target.value)}
      />
      <div>
        <button onClick={onSubmitRecomment}>확인</button>
        <button onClick={onClickCancel}>취소</button>
      </div>
    </div>
  );
}
