'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';
import { getFetchUrl } from '@util';
import { useUserStore } from '@store/user';
import Loading from '@comp/Loading';
import Container from '@comp/post/comment/Container';

export default function Post() {
  const router = useRouter();
  const pathname = usePathname();
  const userId = useUserStore((state) => state.userId);
  const fetchUrl = getFetchUrl(pathname);
  const board = pathname.split('/').at(-2);

  const { data, isLoading, mutate } = useSWR(fetchUrl, () =>
    axios.get(fetchUrl, { withCredentials: true }).then((res) => res.data)
  );

  if (isLoading) return <Loading />;
  const post = data.post;

  const sentiments: any[] = post.sentiment;
  console.log(sentiments);
  const likers: any[] = [];
  const haters: any[] = [];
  sentiments.forEach((sentiment) => {
    if (sentiment.degree > 0) likers.push(sentiment);
    if (sentiment.degree < 0) haters.push(sentiment);
  });

  const likeCount = likers.reduce((acc, cur) => acc + cur.degree, 0);
  const hateCount = haters.reduce((acc, cur) => acc + cur.degree, 0);

  const mySentiment = sentiments.find((sentiment) => {
    return sentiment.userId === userId;
  });

  const onClickLike = async () => {
    if (!mySentiment) router.push('/auth/sign-in');
    const degree = mySentiment.degree < 3 ? mySentiment.degree + 1 : 3;
    try {
      const res = await axios
        .put(`${fetchUrl}/sentiment`, { degree })
        .then((res) => res.data);
      console.log(res);
      await mutate();
    } catch {}
  };

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
        <div>좋아요: {likeCount}</div>
        <div>싫어요: {hateCount}</div>
        <div>
          <button onClick={onClickLike}>좋아요</button>
        </div>
        <div>
          <button>싫어요</button>
        </div>
      </div>
      <div className='p-2' dangerouslySetInnerHTML={{ __html: post.content }} />
      <Container />
    </div>
  );
}
