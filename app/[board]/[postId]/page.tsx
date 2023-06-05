import Link from 'next/link';
import Container from '@comp/post/comment/Container';
import { getFetchUrl } from '@util';

export default async function Post({
  params,
}: {
  params: {
    board: string;
    postId: string;
  };
}) {
  const { board, postId } = params;
  const fetchUrl = getFetchUrl(`/${board}/${postId}`);

  const { post } = await fetch(fetchUrl, {
    cache: 'no-store',
  }).then((res) => res.json());

  return (
    <div className='flex flex-col'>
      <div className='p-2'>
        <Link className='text-sm font-bold' href={{ pathname: `/${board}` }}>
          목록으로
        </Link>
      </div>
      <div className='p-2 border border-dashed border-yellow-700'>
        <div>제목: {post.title}</div>
        <div>작성자: {post.author}</div>
        <div>작성시간: {post.createdAt.toLocaleString('ko-KR')}</div>
      </div>
      <div className='p-2' dangerouslySetInnerHTML={{ __html: post.content }} />
      <Container />
    </div>
  );
}
