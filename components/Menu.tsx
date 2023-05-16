'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useStore } from '@util/store';

const menus: Record<string, any> = {
  signUp: {
    path: 'auth/sign-up',
    name: '회원 가입',
  },
  signIn: {
    path: 'auth/sign-in',
    name: '로그인',
  },
  user: {
    path: 'auth/user',
    name: '회원 정보',
  },
};

export default function Menu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isLogin = useStore((state) => state.isLogin);
  const signOut = useStore((state) => state.signOut);

  async function onClickSignOut() {
    const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/sign-out`;

    try {
      await axios.delete(fetchUrl);
      signOut();
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className='relative z-10 w-full flex flex-col'
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className='self-end px-4'>Menu</div>
      {isOpen && (
        <div
          className='absolute z-10 top-full w-full p-4 flex flex-col
                     items-end gap-2 bg-slate-900'
        >
          <Link href={{ pathname: menus.signUp.path }} key={menus.signUp.path}>
            {menus.signUp.name}
          </Link>
          <Link href={{ pathname: menus.signIn.path }} key={menus.signIn.path}>
            {menus.signIn.name}
          </Link>
          <Link href={{ pathname: menus.user.path }} key={menus.user.path}>
            {menus.user.name}
          </Link>

          {isLogin && <button onClick={onClickSignOut}>로그 아웃</button>}
        </div>
      )}
    </div>
  );
}
