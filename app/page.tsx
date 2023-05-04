import Image from 'next/image';
import { getData } from './util';

export default async function Home(props: any) {
  const data = await getData(__dirname.split('app')[1], props);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {data.message}
    </main>
  );
}
