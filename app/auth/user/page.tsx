import { redirect } from 'next/navigation';
import { validateToken } from '@util/auth';

export default async function UserInfo() {
  const user = await validateToken();
  if (user.error) redirect('/');
  return <div>{user.name}</div>;
}
