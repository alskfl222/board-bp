import Link from 'next/link';

export default function Footer() {
  return (
    <div className='top-full z-10 w-full h-12 flex flex-col justify-center items-center border border-green-300 bg-neutral-700'>
      <div className='relative w-full max-w-[960px] px-4 flex justify-center items-center gap-4 border border-green-500 border-dashed'>
        <div className=''>Github</div><Link href={'https://github.com/alskfl222/board-bp'}>Link</Link>
      </div>
    </div>
  );
}
