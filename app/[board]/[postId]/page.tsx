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
  }) ?? { degree: 0 };

  const onClickLike = async () => {
    if (userId === -1) {
      alert('로그인 필요');
      router.push('/auth/sign-in');
      return;
    }
    if (mySentiment.degree >= 3) {
      alert('3추 이상 금지');
      return;
    }
    const degree = mySentiment.degree + 1;
    try {
      const res = await axios
        .put(`${fetchUrl}/sentiment`, { degree })
        .then((res) => res.data);
      console.log(res);
      await mutate();
    } catch {}
  };

  const onClickHate = async () => {
    if (userId === -1) {
      alert('로그인 필요');
      router.push('/auth/sign-in');
      return;
    }
    if (mySentiment.degree <= -3) {
      alert('3비추 이상 금지');
      return;
    }
    const degree = mySentiment.degree - 1;
    try {
      const res = await axios
        .put(`${fetchUrl}/sentiment`, { degree })
        .then((res) => res.data);
      console.log(res);
      await mutate();
    } catch {}
  };

  const toDateString = (createdAt: string) => {
    const date = new Date(createdAt);
    return `${date.getFullYear()}. ${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}. ${date
      .getDate()
      .toString()
      .padStart(2, '0')}. ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
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
        <div>작성시간: {toDateString(post.createdAt)}</div>
        <div>조회수: {post.view}</div>
        <div className='p-2 flex justify-center gap-4 border border-dashed border-yellow-900'>
          <button className='border' onClick={onClickLike}>
            좋아요: {likeCount}
          </button>
          <button className='border' onClick={onClickHate}>
            싫어요: {hateCount}
          </button>
        </div>
      </div>
      <div className='p-2' dangerouslySetInnerHTML={{ __html: post.content }} />
      <Container />
    </div>
  );
}
