import './globals.css';
import { headers } from 'next/headers';
import { Noto_Sans_KR } from 'next/font/google';

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
  const headersList = headers();
  const path = headersList.get('x-invoke-path');

  return (
    <html lang='ko'>
      <body className={notoSans.className}>
        {path !== '/' && <div>header</div>}
        {children}
      </body>
    </html>
  );
}
