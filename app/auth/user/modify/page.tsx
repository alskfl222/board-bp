'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';
import Loading from '@comp/Loading';
import { useUserStore } from '@store/user';
import { exceptionHandler, getFetchUrl } from '@util';

export default function UserModify() {
  const router = useRouter();
  const signOut = useUserStore((state) => state.signOut);
  const fetchUrl = getFetchUrl('/auth');
  const { data, isLoading, mutate } = useSWR(fetchUrl, () =>
    axios.get(fetchUrl, { withCredentials: true }).then((res) => res.data)
  );

  const [id, setId] = useState(-1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  useEffect(() => {
    if (data) {
      setId(data.id);
      setName(data.name);
      setEmail(data.email);
    }
  }, [data]);

  if (isLoading) return <Loading />;

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      await mutate();
    } catch (e) {
      exceptionHandler(e);
    }
  };

  const handleDelete = async () => {
    // setIsLoading(true);
    try {
      const response = await axios.delete(fetchUrl);
      console.log(response.data);
      alert('Success Delete');
      signOut();
      router.push('/');
    } catch (e) {
      exceptionHandler(e);
    }
  };

  return (
    <>
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
