import Image from 'next/image';
import EmoticonContainer from '../emoticon/Container';
import { Modify } from './Button';
import { useContext } from 'react';
import { CommentContext } from '@context/Comment';

export default function Content() {
  const {
    mode,
    emoticons,
    content,
    selected,
    remove,
    isEmoticonsExpanded,
    setIsEmoticonsExpanded,
    inputText,
    setInputText,
    onSubmitModify,
    onClickCancel,
  } = useContext(CommentContext);

  return (
    <div className='p-2'>
      {mode !== 'modify' ? (
        <div className='flex flex-col gap-2'>
          {emoticons.length > 0 && (
            <div className='flex gap-2'>
              {emoticons.map((emoticon, index) => {
                return (
                  <Image
                    key={`${emoticon.id}_${index}`}
                    src={`/emoticon/${emoticon.kind}/${emoticon.path}`}
                    alt={emoticon.name}
                    title={emoticon.name}
                    width={100}
                    height={100}
                  />
                );
              })}
            </div>
          )}
          <div>{content.current}</div>
        </div>
      ) : (
        <div>
          <EmoticonContainer
            selected={selected}
            remove={remove}
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
  );
}
