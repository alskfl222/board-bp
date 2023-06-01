import Link from 'next/link';
import { redirect } from 'next/navigation';
import Container from '@comp/post/comment/Container';
import prisma from '@util/db';

export default async function Post({
  params,
}: {
  params: { board: string; postId: string };
}) {
  const postId = parseInt(params.postId);
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) redirect(`/${params.board}`);

  const user = await prisma.user.findUnique({ where: { id: post.authorId } });

  return (
    <div className='flex flex-col'>
      <div className='p-2'>
        <Link
          className='text-sm font-bold'
          href={{ pathname: `/${params.board}` }}
        >
          목록으로
        </Link>
      </div>
      <div className='p-2 border border-dashed border-yellow-700'>
        <div>제목: {post.title}</div>
        <div>작성자: {user?.name}</div>
        <div>작성시간: {post.createdAt.toLocaleString('ko-KR')}</div>
      </div>
      <div className='p-2' dangerouslySetInnerHTML={{ __html: post.content }} />
      <Container />
    </div>
  );
}
