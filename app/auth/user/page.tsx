'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getFetchUrl } from '@util/fetch';
import axios from 'axios';

export default function UserInfo() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const fetchUrl = getFetchUrl(pathname);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (newPassword !== newPasswordConfirm) return alert('Check new password');
    try {
      const response = await axios.put(fetchUrl, {
        id,
        name,
        email,
        password,
        newPassword,
      });
      console.log(response.data);
    } catch (e) {
      alert('Fetch Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function initUser() {
      try {
        const response = await axios.get(fetchUrl);
        const { id, name, email } = response.data;
        setId(id);
        setName(name);
        setEmail(email);
      } catch (e) {
        alert('Invalid Token');
        router.push('auth/sign-in');
      } finally {
        setIsLoading(false);
      }
    }
    initUser();
  }, [router, pathname]);

  return (
    <>
      {isLoading && (
        <div
          className='absolute z-1 w-full h-full flex justify-center items-center
                     bg-neutral-100/90 text-black'
        >
          <div>LOADING...</div>
        </div>
      )}
      <form className='flex flex-col gap-4' onSubmit={handleUpdate}>
        <p>NAME: </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='text-black'
        />{' '}
        <p>EMAIL: </p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='text-black'
        />
        <p>CURRENT PASSWORD: </p>
        <input
          value={password}
          type='password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className='text-black'
        />
        <p>NEW PASSWORD: </p>
        <input
          value={newPassword}
          type='password'
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
          className='text-black'
        />
        <p>NEW PASSWORD CONFIRM: </p>
        <input
          value={newPasswordConfirm}
          type='password'
          onChange={(e) => {
            setNewPasswordConfirm(e.target.value);
          }}
          className='text-black'
        />
        <button type='submit'>수정</button>
      </form>
    </>
  );
}
