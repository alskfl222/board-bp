import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@db';
import { commonMenus } from '@data/menu';
import List from '@comp/post/list/List';
import Pagination from '@comp/pagination/Server';

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
  const take = 15;
  const skip = (page - 1) * take;

  const count = await prisma.post.count({ where: { boardId: board.id } });

  const posts = await prisma.post.findMany({
    where: { boardId: board.id },
    skip,
    take,
    select: {
      id: true,
      title: true,
      author: true,
      view: true,
      degree_sum: true,
      createdAt: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  return (
    <div>
      <h1>{`${commonMenus[board.name].name}`}</h1>
      <div className='p-2 flex items-center'>
        <Link href={{ pathname: `/${board.name}/new` }} className='text-sm'>
          글쓰기
        </Link>
      </div>
      {posts.length > 0 ? (
        <>
          <div>총 {count}개</div>
          <List board={board.name} posts={posts} />
          <Pagination pathname={`/$board.name}`} count={count} page={page} />
        </>
      ) : (
        <div>게시글이 없습니다</div>
      )}
    </div>
  );
}
