// frontend/src/app/layout.tsx

// This is the root layout for the entire application.
// It's a required file in the Next.js App Router.

// 1. 'Suspense'를 사용하기 위해 'react'에서 임포트합니다.
import { Suspense } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';

// ------------------------------------------------------------------
// ⭐ 오류를 해결하기 위해 Alias(@components) 대신 상대 경로를 사용합니다.
// 현재 위치(src/app)에서 상위 폴더(src)로 이동 후 components 폴더에 접근합니다.
import Navbar from '../components/Navbar'; 
// ------------------------------------------------------------------

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CaravanShare',
  description: 'Share and rent caravans with ease.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* Render the Navbar component */}
        
        {/* 2. 모든 하위 페이지(children)를 <Suspense>로 감싸서 동적 클라이언트 훅 문제를 해결합니다. */}
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}