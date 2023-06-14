import { useState, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Comment, ListType } from './List';
import { commonMenus } from '@data/menu';
import { toDateString } from '@util';

export default function Table({
  comments,
  type,
  setType,
}: {
  comments: Comment[];
  type: ListType;
  setType: Dispatch<SetStateAction<ListType>>;
}) {
  const [isReversed, setIsReversed] = useState(false);
  const onClickType = (clickedType: ListType) => () => {
    if (type === clickedType) {
      setIsReversed((state) => !state);
    } else {
      setType(clickedType);
      setIsReversed(false);
    }
  };

  const lists = !isReversed ? comments : comments.slice().reverse();

  return (
    <table className='w-full p-2 flex flex-col'>
      <thead>
        <tr className='w-full flex border border-yellow-500'>
          <td
            className='flex-[2_2_0] flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
          >
            게시판
          </td>
          <td
            className='flex-[5_5_0] px-4 flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
          >
            제목
          </td>
          <td
            className='flex-[10_10_0] flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
          >
            내용
          </td>
          <td
            className='flex-[2_2_0] flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
          >
            <button onClick={onClickType('like')}>반응</button>
          </td>
          <td
            className='flex-[2_2_0] flex flex-col justify-center items-center 
                             border-r border-dashed border-yellow-700 text-xs'
          >
            <button onClick={onClickType('latest')}>작성시간</button>
          </td>
        </tr>
      </thead>
      <tbody>
        {lists.length > 0 ? (
          lists.map((comment) => {
            return (
              <tr
                key={comment.id}
                className='w-full flex border border-yellow-500'
              >
                <td
                  className='flex-[2_2_0] flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
                >
                  {commonMenus[comment.board].name}
                </td>
                <td
                  className='flex-[5_5_0] px-4 flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
                >
                  <Link
                    href={{ pathname: `/${comment.board}/${comment.postId}` }}
                  >
                    {comment.post}
                  </Link>
                </td>
                <td
                  className='flex-[10_10_0] flex flex-col justify-center items-center gap-2
                             border-r border-dashed border-yellow-700'
                >
                  <div className='flex gap-2'>
                    {comment.emoticons.length > 0 &&
                      comment.emoticons.map((emoticon) => {
                        return (
                          <Image
                            key={emoticon.name}
                            src={`/emoticon/${emoticon.list}/${emoticon.path}`}
                            alt={emoticon.name}
                            title={emoticon.name}
                            width={50}
                            height={50}
                          />
                        );
                      })}
                  </div>
                  <div>{comment.content}</div>
                </td>
                <td
                  className='flex-[2_2_0] flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
                >
                  {comment.degree_sum}
                </td>
                <td
                  className='flex-[2_2_0] flex flex-col justify-center items-center 
                             border-r border-dashed border-yellow-700 text-xs'
                >
                  <div>{toDateString(comment.createdAt).date}</div>
                  <div>{toDateString(comment.createdAt).time}</div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>쓴 글 없음</tr>
        )}
      </tbody>
    </table>
  );
}
