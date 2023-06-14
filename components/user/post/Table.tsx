import { useState, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { Post, ListType } from './List';
import { commonMenus } from '@data/menu';
import { toDateString } from '@util';

export default function Table({
  posts,
  type,
  setType,
}: {
  posts: Post[];
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

  const lists = !isReversed ? posts : posts.slice().reverse();

  return (
    <table className='w-full p-2 flex flex-col'>
      <thead>
        <tr className='w-full flex border border-yellow-500'>
          <th
            className='flex-1 flex justify-center items-center 
                       border-x border-dashed border-yellow-700'
          >
            <button onClick={onClickType('latest')}>ID</button>
          </th>
          <th
            className='flex-[2_2_0] flex justify-center items-center 
                       border-r border-dashed border-yellow-700'
          >
            게시판
          </th>
          <th
            className='flex-[13_13_0] px-4 flex justify-center items-center 
                       border-r border-dashed border-yellow-700'
          >
            제목
          </th>
          <th
            className='flex-[2_2_0] flex justify-center items-center 
                       border-r border-dashed border-yellow-700'
          >
            <button onClick={onClickType('view')}>조회수</button>
          </th>
          <th
            className='flex-[2_2_0] flex justify-center items-center 
                       border-r border-dashed border-yellow-700'
          >
            <button onClick={onClickType('like')}>반응</button>
          </th>
          <th
            className='flex-[2_2_0] flex justify-center items-center 
                       border-r border-dashed border-yellow-700'
          >
            <button onClick={onClickType('latest')}>작성시간</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {lists.length > 0 ? (
          lists.map((post) => {
            return (
              <tr
                key={post.id}
                className='w-full flex border border-yellow-500'
              >
                <td
                  className='flex-1 flex justify-center items-center 
                             border-x border-dashed border-yellow-700'
                >
                  {post.id}
                </td>
                <td
                  className='flex-[2_2_0] flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
                >
                  {commonMenus[post.board].name}
                </td>
                <td
                  className='flex-[13_13_0] px-4 flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
                >
                  <Link href={{ pathname: `/${post.board}/${post.id}` }}>
                    {post.title}
                  </Link>
                </td>
                <td
                  className='flex-[2_2_0] flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
                >
                  {post.view}
                </td>
                <td
                  className='flex-[2_2_0] flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
                >
                  {post.degree_sum}
                </td>
                <td
                  className='flex-[2_2_0] flex flex-col justify-center items-center 
                             border-r border-dashed border-yellow-700 text-xs'
                >
                  <div>{toDateString(post.createdAt).date}</div>
                  <div>{toDateString(post.createdAt).time}</div>
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
