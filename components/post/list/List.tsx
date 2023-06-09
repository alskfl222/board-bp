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
        `${createdAt.getHours().toString().padStart(2, '0')}시 ` +
        `${createdAt.getMinutes().toString().padStart(2, '0')}분`
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
      <div className='w-full p-2 grid grid-cols-12 border border-yellow-500'>
        <div className='flex justify-center border-x border-dashed border-yellow-700'>
          ID
        </div>
        <div className='col-span-7 px-4 border-r border-dashed border-yellow-700'>
          제목
        </div>
        <div className='col-span-2 flex justify-center border-r border-dashed border-yellow-700'>
          작성자
        </div>
        <div className='col-span-2 flex justify-center border-r border-dashed border-yellow-700'>
          시간
        </div>
      </div>
      {posts.length > 0 &&
        posts.map((post) => {
          return (
            <Link
              href={{ pathname: `/${board}/${post.id}` }}
              key={post.id}
              className='w-full p-2 grid grid-cols-12 border border-yellow-500'
            >
              <div className='flex justify-center border-x border-dashed border-yellow-700'>
                {post.id}
              </div>
              <div className='col-span-7 px-4 border-r border-dashed border-yellow-700'>
                {post.title}
              </div>
              <div className='col-span-2 flex justify-center border-r border-dashed border-yellow-700'>
                {post.author.name}
              </div>
              <div className='col-span-2 flex justify-center border-r border-dashed border-yellow-700'>
                {toDateString(post.createdAt)}
              </div>
            </Link>
          );
        })}
    </div>
  );
}
