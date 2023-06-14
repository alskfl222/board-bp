import Link from 'next/link';
import { redirect } from 'next/navigation';
import PostList from '@comp/user/post/List';
import CommentList from '@comp/user/comment/List';
import { validateToken } from '@auth';

export default async function UserInfo() {
  const user = await validateToken();
  if ('error' in user) {
    redirect('/auth/sign-in');
  }

  return (
    <div className='w-full p-2 flex flex-col gap-2'>
      <div className='w-full p-2 border'>
        <div>이름: {user.name}</div>
        <div>이메일: {user.email}</div>
        <div>가입: {user.createdAt?.toISOString()}</div>
        <div>
          <Link href={{ pathname: 'auth/user/modify' }}>수정</Link>
        </div>
      </div>

      <PostList />
      <CommentList />
    </div>
  );
}
