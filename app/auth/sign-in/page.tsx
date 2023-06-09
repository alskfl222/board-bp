'use client';

import { FormEvent, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { useUserStore } from '@store/user';
import { getFetchUrl } from '@util';

export default function SignIn() {
  const router = useRouter();
  const pathname = usePathname();
  const signIn = useUserStore((state) => state.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fetchUrl = getFetchUrl(pathname);

    try {
      const { data } = await axios.post(fetchUrl, { email, password });
      signIn(data.userId);
      router.back();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <p>EMAIL: {email}</p>
        <input
          className='text-black'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete='username'
        />
        <p>PASSWORD: {password.length}</p>
        <input
          type='password'
          className='text-black'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='current-password'
        />
        <button type='submit'>로그인</button>
      </form>
    </>
  );
}
