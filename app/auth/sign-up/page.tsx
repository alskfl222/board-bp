'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { getFetchUrl, createFormData } from '@util';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState<FileList | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fetchUrl = getFetchUrl('/auth');
    const formData = createFormData({ email, password, name });

    try {
      await axios.post(fetchUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('auth/sign-in');
    } catch (err) {
      console.error(err);
    } finally {
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
          multiple
          onChange={(e) => setThumbnail(e.target.files || null)}
        />
        {thumbnail && (
          <Image
            src={URL.createObjectURL(thumbnail[0])}
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
