import prisma from '@util/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function BoardList({
  params,
  searchParams,
}: {
  params: { board: string };
  searchParams: { page: string };
}) {
  const board = await prisma.board.findUnique({
    where: { name: params.board },
  });
  if (!board) {
    redirect('/');
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const take = 5;
  const skip = (page - 1) * take;

  const posts = await prisma.post.findMany({
    where: { boardId: board.id },
    skip,
    take,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      id: 'desc'
    }
  });

  return (
    <div className='w-full'>
      {posts.length > 0 &&
        posts.map((post) => {
          return (
            <Link
              href={{ pathname: `/${board.name}/${post.id}` }}
              key={post.id}
              className='w-full p-2 grid grid-cols-6 border border-yellow-500'
            >
              <div className='border-r border-dashed border-yellow-700'>
                {post.id}
              </div>
              <div className='col-span-3 border-r border-dashed border-yellow-700'>
                {post.title}
              </div>
              <div className='col-span-2'>{post.author.name} {post.createdAt.toISOString()}</div>
            </Link>
          );
        })}
    </div>
  );
}
