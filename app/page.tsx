import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

async function getWelcomData() {
  const res = await fetch('http://localhost:3000/api', {
    next: { revalidate: 10 },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function Home() {
  const welcomeData = await getWelcomData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {welcomeData.message}
    </main>
  );
}
