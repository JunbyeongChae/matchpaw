import type { Metadata } from 'next';
import { IBM_Plex_Mono, Plus_Jakarta_Sans, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/common/QueryProvider';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-label',
});

export const metadata: Metadata = {
  title: 'matchpaw — 유기동물 입양 AI 매칭',
  description: '라이프스타일 설문으로 나에게 맞는 유기동물을 추천받으세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`h-full ${ibmPlexMono.variable} ${plusJakartaSans.variable} ${beVietnamPro.variable}`}
    >
      <body className="min-h-full bg-surface-page">
        <QueryProvider>
          <Header />
          <main className="pt-16 pb-24">{children}</main>
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
