'use client';

import { useState, useEffect, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { fetchData, submitForm } from '@util/fetch';

export default function UserInfo() {
  const pathname = usePathname();
  const [data, setData] = useState<Record<string, any>>({
    name: '',
    email: '',
  });
  const [pw, setPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwConfirm, setNewPwConfirm] = useState('');

  const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
    if (newPw !== newPwConfirm) return alert('Check new password');
    return submitForm(
      pathname,
      { ...data, password: pw, newPassword: newPw },
      { method: 'put', redirect: '/auth' }
    )(e);
  };

  useEffect(() => {
    fetchData(pathname, setData);
  }, [pathname]);

  return (
    <form className='flex flex-col gap-4' onSubmit={handleUpdate}>
      <p>NAME: </p>
      <input
        value={data.name}
        onChange={(e) => {
          setData((prev) => {
            return { ...prev, name: e.target.value };
          });
        }}
        className='text-black'
      />{' '}
      <p>EMAIL: </p>
      <input
        value={data.email}
        onChange={(e) => {
          setData((prev) => {
            return { ...prev, email: e.target.value };
          });
        }}
        className='text-black'
      />
      <p>CURRENT PASSWORD: </p>
      <input
        value={pw}
        type='password'
        onChange={(e) => {
          setPw(e.target.value);
        }}
        className='text-black'
      />
      <p>NEW PASSWORD: </p>
      <input
        value={newPw}
        type='password'
        onChange={(e) => {
          setNewPw(e.target.value);
        }}
        className='text-black'
      />
      <p>NEW PASSWORD CONFIRM: </p>
      <input
        value={newPwConfirm}
        type='password'
        onChange={(e) => {
          setNewPwConfirm(e.target.value);
        }}
        className='text-black'
      />
      <button type='submit'>수정</button>
    </form>
  );
}
