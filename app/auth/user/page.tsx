import { validateToken } from '@util/auth';

export default async function UserInfo() {
  const user = await validateToken();
  console.log(user)
  return <>{user ? 'true' : 'false'}</>;
}
