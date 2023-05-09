'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { handleSubmit } from '@util/fetch';

export default function SignUp() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit(pathname, { email, password }, '/auth/user')}
      >
        <p>EMAIL: {email}</p>
        <input
          className='text-black'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>PASSWORD: {password.length}</p>
        <input
          type='password'
          className='text-black'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>로그인</button>
      </form>
    </>
  );
}
