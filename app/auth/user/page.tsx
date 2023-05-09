import { validateToken } from '@util/auth';

export default async function UserInfo() {
  const user = await validateToken();
  return <>{!user.error ? user.name : '토큰 망'}</>;
}
