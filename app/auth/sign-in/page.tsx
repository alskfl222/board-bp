'use client';

import { useState } from 'react';
import { submitLogin } from '@util/fetch';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <form
        className='flex flex-col gap-4'
        onSubmit={submitLogin({ email, password })}
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
