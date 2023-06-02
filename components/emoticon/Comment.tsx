import Image from 'next/image';

export default function CommentEmoticonContainer() {
  return (
    <div className='flex gap-2'>
      <Image src='/emoticon/maple-dol/1.png' alt='emoticon' width={100} height={100}/>
      <Image src='/emoticon/maple-dol/1.png' alt='emoticon' width={100} height={100}/>
      <Image src='/emoticon/maple-dol/1.png' alt='emoticon' width={100} height={100}/>
    </div>
  );
}
