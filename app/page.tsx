import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center'>
      <Link href={{ pathname: '/auth/sign-up' }}>회원가입</Link>
      <div>Welcome!</div>
    </main>
  );
}
