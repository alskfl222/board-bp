'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { state } from '@util/state';

const menus: Record<string, any> = {
  'sign-up': {
    path: 'auth/sign-up',
    name: '회원 가입',
  },
  'sign-in': {
    path: 'auth/sign-in',
    name: '로그인',
  },
  user: {
    path: 'auth/user',
    name: '회원 정보',
  },
};

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLogin } = state

  return (
    <div
      className='relative w-full flex flex-col'
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className='self-end px-4'>Menu</div>
      {isOpen && (
        <div
          className='absolute top-full w-full p-4 flex flex-col
                        items-end gap-2 bg-slate-900'
        >
          {Object.keys(menus).map((menu) => {
            return (
              <Link href={{ pathname: menus[menu].path }} key={menu}>
                {menus[menu].name}
              </Link>
            );
          })}
          {isLogin && <button onClick={() => {}}>로그 아웃</button>}
        </div>
      )}
    </div>
  );
}