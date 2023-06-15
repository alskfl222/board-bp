import Link from 'next/link';
import { redirect } from 'next/navigation';
import PostList from '@comp/user/post/List';
import CommentList from '@comp/user/comment/List';
import prisma from '@db';
import { validateToken } from '@auth';

export default async function UserInfo() {
  const user = await validateToken();
  if ('error' in user) {
    redirect('/auth/sign-in');
  }
  const sentPostSentiments = await prisma.postSentiment.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      degree: true,
    },
  });

  const sentCommentSentiments = await prisma.commentSentiment.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      degree: true,
    },
  });

  const sentSentiments = {
    post: {
      sum: sentPostSentiments._sum.degree || 0,
      count: await prisma.postSentiment.count({ where: { userId: user.id } }),
    },
    comment: {
      sum: sentCommentSentiments._sum.degree || 0,
      count: await prisma.commentSentiment.count({
        where: { userId: user.id },
      }),
    },
  };

  const receivedPostSentiments = await prisma.post.aggregate({
    where: { authorId: user.id },
    _sum: {
      degree_sum: true,
    },
  });

  const receivedCommentSentiments = await prisma.comment.aggregate({
    where: { authorId: user.id },
    _sum: {
      degree_sum: true,
    },
  });

  const receivedSentiments = {
    post: {
      sum: receivedPostSentiments._sum.degree_sum || 0,
      count: await prisma.post.count({ where: { authorId: user.id } }),
    },
    comment: {
      sum: receivedCommentSentiments._sum.degree_sum || 0,
      count: await prisma.comment.count({ where: { authorId: user.id } }),
    },
  };

  return (
    <div className='w-full p-2 flex flex-col gap-2'>
      <div className='w-full p-2 border'>
        <div>이름: {user.name}</div>
        <div>이메일: {user.email}</div>
        <div>가입: {user.createdAt?.toISOString()}</div>
        <div>
          <span>
            내가 한 좋아요/싫어요:{' '}
            {sentSentiments.post.sum + sentSentiments.comment.sum}
          </span>{' '}
          <div>
            <span>
              게시글 {sentSentiments.post.count} 개에서 :{' '}
              {sentSentiments.post.sum}
            </span>{' '}
            <span>
              댓글 {sentSentiments.comment.count} 개에서 :{' '}
              {sentSentiments.comment.sum}
            </span>
          </div>
        </div>
        <div>
          <span>
            내가 받은 좋아요/싫어요:{' '}
            {receivedSentiments.post.sum + receivedSentiments.comment.sum}
          </span>{' '}
          <div>
            <span>
              게시글 {receivedSentiments.post.count} 개에서 :{' '}
              {receivedSentiments.post.sum}
            </span>{' '}
            <span>
              댓글 {receivedSentiments.comment.count} 개에서 :{' '}
              {receivedSentiments.comment.sum}
            </span>
          </div>
        </div>
        <div>
          <Link href={{ pathname: 'auth/user/modify' }}>수정</Link>
        </div>
      </div>

      <PostList />
      <CommentList />
    </div>
  );
}
