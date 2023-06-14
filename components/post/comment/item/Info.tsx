import axios from 'axios';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Read } from './Button';
import { CommentContext } from '@context/Comment';
import { exceptionHandler, getFetchUrl, toDateString } from '@util';

export default function Info() {
  const router = useRouter();
  const {
    isLogin,
    id,
    postAuthorId,
    author,
    authorId,
    createdAt,
    sentiments,
    userId,
    setMode,
    mutate,
    pathname,
  } = useContext(CommentContext);

  const fetchUrl = getFetchUrl(`${pathname}/comment`);

  const onClickDelete = async () => {
    try {
      await axios.delete(`${fetchUrl}/${id}`);
      await mutate();
      setMode('read');
    } catch (err) {
      exceptionHandler(err);
    }
  };

  const likers: any[] = [];
  const haters: any[] = [];
  sentiments.forEach((sentiment: any) => {
    if (sentiment.degree > 0) likers.push(sentiment);
    if (sentiment.degree < 0) haters.push(sentiment);
  });

  const likeCount = likers.reduce((acc, cur) => acc + cur.degree, 0);
  const hateCount = haters.reduce((acc, cur) => acc + cur.degree, 0);

  const mySentiment = sentiments.find((sentiment: any) => {
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
        .put(`${fetchUrl}/${id}/sentiment`, { degree })
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
        .put(`${fetchUrl}/${id}/sentiment`, { degree })
        .then((res) => res.data);
      await mutate();
    } catch (err) {
      exceptionHandler(err);
    }
  };

  return (
    <div className='w-full p-2 flex justify-between border border-lime-700'>
      <div className='flex gap-2'>
        <div>
          {postAuthorId === authorId && '[작성자]'}
          {userId === authorId && '[나]'}
          {' ' + author}
        </div>
        /<div>{toDateString(createdAt).date} {toDateString(createdAt).time}</div>
      </div>
      <div className='border border-dashed border-lime-900 text-sm'>
        <div className=''>
          {isLogin && <div>내 투표: {mySentiment.degree}</div>}
          <div className='flex gap-2'>
            <button onClick={onClickLike}>좋아요 {likeCount}</button>/
            <button onClick={onClickHate}>싫어요 {hateCount}</button>
          </div>
        </div>
        {isLogin && <Read onClickDelete={onClickDelete} />}
      </div>
    </div>
  );
}
