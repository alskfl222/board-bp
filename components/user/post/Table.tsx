import Link from 'next/link';
import { Post } from './List';
import { commonMenus } from '@data/menu';
import { toDateString } from '@util';

export default function Table({ posts }: { posts: Post[] }) {
  return (
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
