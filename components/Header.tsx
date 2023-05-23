'use client';

import Link from 'next/link';
import Menu from './menu/Menu';

export default function Header() {
  return (
    <div className='fixed z-10 w-screen h-12 flex flex-col justify-center items-center border border-green-300 bg-neutral-700'>
      <div className='relative w-full max-w-[960px] px-4 flex justify-between items-center border border-green-500 border-dashed'>
        <div className='w-full'>
          <Link href={{ pathname: '/' }}>Home</Link>
        </div>
        <div className='w-full'>Header</div>
        <Menu />
      </div>
    </div>
  );
}
