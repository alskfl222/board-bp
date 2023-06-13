import Link from 'next/link';
import { Post } from '@prisma/client';

export default function List({
  board,
  posts,
}: {
  board: string;
  posts: {
    id: number;
    title: string;
    author: {
      name: string;
    };
    view: number;
    degree_sum: number;
    createdAt: Date;
  }[];
}) {
  const toDateString = (createdAt: Date) => {
    const today = new Date();
    if (
      today.getFullYear() === createdAt.getFullYear() &&
      today.getMonth() === createdAt.getMonth() &&
      today.getDate() === createdAt.getDate()
    ) {
      return (
        `${createdAt.getHours().toString().padStart(2, '0')}:` +
        `${createdAt.getMinutes().toString().padStart(2, '0')}`
      );
    } else {
      return (
        `${(createdAt.getMonth() + 1).toString()}. ` +
        `${createdAt.getDate().toString()}.`
      );
    }
  };

  return (
    <div className='flex flex-col gap-1'>
      <table className='w-full p-2 flex flex-col'>
        <thead>
          <tr className='w-full flex border border-yellow-500'>
            <th
              className='flex-1 flex justify-center items-center 
                       border-x border-dashed border-yellow-700'
            >
              ID
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
              조회수
            </th>
            <th
              className='flex-[2_2_0] flex justify-center items-center 
                       border-r border-dashed border-yellow-700'
            >
              반응
            </th>
            <th
              className='flex-[2_2_0] flex justify-center items-center 
                       border-r border-dashed border-yellow-700'
            >
              작성시간
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => {
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
                    className='flex-[13_13_0] px-4 flex justify-center items-center 
                             border-r border-dashed border-yellow-700'
                  >
                    <Link href={{ pathname: `/${board}/${post.id}` }}>
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
                    <div>{toDateString(post.createdAt)}</div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>쓴 글 없음</tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
