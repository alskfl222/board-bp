'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';
import Loading from '@comp/Loading';
import Viewer from '@comp/editor/Viewer';
import CommentContainer from '@comp/post/comment/Container';
import { useUserStore } from '@store/user';
import { exceptionHandler, getFetchUrl, toDateString } from '@util';

export default function Post() {
  const router = useRouter();
  const pathname = usePathname();
  const userId = useUserStore((state) => state.userId);
  const fetchUrl = getFetchUrl(pathname);
  const board = pathname.split('/').at(-2);

  const { data, error, isLoading, mutate } = useSWR(fetchUrl, () =>
    axios.get(fetchUrl, { withCredentials: true }).then((res) => res.data)
  );

  if (isLoading) return <Loading />;
  if (error) {
    router.push(`/${board}`);
    return <div>error</div>;
  }
  const post = data.post;

  const sentiments: any[] = post.sentiments;
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
      await axios
        .put(`${fetchUrl}/sentiment`, { degree })
        .then((res) => res.data);
      await mutate();
    } catch (err) {
      exceptionHandler(err);
    }
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
      await axios
        .put(`${fetchUrl}/sentiment`, { degree })
        .then((res) => res.data);
      await mutate();
    } catch (err) {
      exceptionHandler(err);
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='p-2 flex justify-between'>
        <Link className='text-sm font-bold' href={{ pathname: `/${board}` }}>
          목록으로
        </Link>
        <Link
          className='text-sm font-bold'
          href={{ pathname: `${pathname}/modify` }}
        >
          수정
        </Link>
      </div>
      <div className='p-2 border border-dashed border-yellow-700'>
        <div>제목: {post.title}</div>
        <div>
          작성자: {post.author} {post.authorId === userId && '[나]'}
        </div>
        <div>
          작성시간: {toDateString(post.createdAt).date}{' '}
          {toDateString(post.createdAt).time}
        </div>
        <div>조회수: {post.view}</div>
        <div className='p-2 flex justify-center gap-4 border border-dashed border-yellow-900'>
          {userId > -1 && <div>내 투표: {mySentiment.degree}</div>}
          <button className='border' onClick={onClickLike}>
            좋아요: {likeCount}
          </button>
          <button className='border' onClick={onClickHate}>
            싫어요: {hateCount}
          </button>
        </div>
      </div>
      <Viewer content={post.content} />
      <CommentContainer />
    </div>
  );
}
