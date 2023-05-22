'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SubMenu from './SubMenu';
import { useStore } from '@util/store';

const loginMenus: Record<string, Record<string, string>> = {
  user: {
    path: 'auth/user',
    name: '회원 정보',
  },
};

const logoutMenus: Record<string, Record<string, string>> = {
  signUp: {
    path: 'auth/sign-up',
    name: '회원 가입',
  },
  signIn: {
    path: 'auth/sign-in',
    name: '로그인',
  },
};

export default function Menu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isLogin = useStore((state) => state.isLogin);
  const signOut = useStore((state) => state.signOut);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleClickOutside(e: any) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }

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
      ref={menuRef}
      className='relative z-10 w-full flex flex-col'
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className='self-end px-4'>Menu</div>
      {isOpen && (
        <div
          className='absolute z-10 top-full w-full p-4 flex flex-col
                     items-end gap-2 bg-slate-900'
        >
          {isLogin ? (
            <SubMenu menus={loginMenus} logout={onClickSignOut} />
          ) : (
            <SubMenu menus={logoutMenus} />
          )}
          <div>---------</div>
        </div>
      )}
    </div>
  );
}
