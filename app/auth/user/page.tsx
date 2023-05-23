'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loading from '@comp/Loading';
import { useStore } from '@util/store';
import { getFetchUrl } from '@util/fetch';

export default function UserInfo() {
  const router = useRouter();
  const signOut = useStore((state) => state.signOut);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const fetchUrl = getFetchUrl('/auth');

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

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(fetchUrl);
      console.log(response.data);
      alert('Success Delete');
      signOut()
      router.push('/');
    } catch (e) {
      alert('Fetch Delete Error');
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
  }, [router, fetchUrl]);

  return (
    <>
      {isLoading && <Loading />}
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
      <div>
        <button onClick={handleDelete}>탈퇴</button>
      </div>
    </>
  );
}
