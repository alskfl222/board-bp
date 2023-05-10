'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { submitForm } from '@util/fetch';

export default function SignUp() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  return (
    <>
      <form
        className='flex flex-col gap-4'
        onSubmit={submitForm(
          pathname,
          { email, password, name },
          { redirect: '/' }
        )}
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
        <p>NAME: {name}</p>
        <input
          className='text-black'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>THUMBNAIL: {thumbnail ? '있음' : '없음'}</p>
        <input
          type='file'
          onChange={(e) =>
            setThumbnail(e.target.files ? e.target.files[0] : null)
          }
        />
        {thumbnail && (
          <Image
            src={URL.createObjectURL(thumbnail)}
            alt='thumbnail preview'
            width={240}
            height={240}
          />
        )}
        <button type='submit'>가입</button>
      </form>
    </>
  );
}
