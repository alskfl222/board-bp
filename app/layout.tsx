import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import Header from '@comp/Header';
import Footer from '@comp/Footer';

const notoSans = Noto_Sans_KR({ weight: '400', subsets: ['latin'] });

export const metadata = {
  title: 'alskfl222 board-bp',
  description: 'using Next.js 13',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body className={`${notoSans.className} w-screen`}>
        <div className='min-h-screen flex flex-col items-center'>
          <Header />
          <div className='w-full max-w-[960px] mt-12 flex'>{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
