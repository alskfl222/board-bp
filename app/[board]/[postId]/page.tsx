'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';
import { getFetchUrl } from '@util';
import Loading from '@comp/Loading';
import Container from '@comp/post/comment/Container';

export default function Post() {
  const pathname = usePathname();
  const fetchUrl = getFetchUrl(pathname);
  const board = pathname.split('/').at(-2);

  const { data, error, isLoading } = useSWR(fetchUrl, () =>
    axios.get(fetchUrl, { withCredentials: true }).then((res) => res.data)
  );

  if (isLoading) return <Loading />;
  const post = data.post;

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
        <div>조회수: {post.view}</div>
        <div>좋아요: {post.like}</div>
        <div>싫어요: {post.hate}</div>
      </div>
      <div className='p-2' dangerouslySetInnerHTML={{ __html: post.content }} />
      <Container />
    </div>
  );
}
