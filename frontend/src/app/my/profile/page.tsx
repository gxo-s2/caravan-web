"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 사용자 정보를 확인합니다.
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      // 로그인된 상태이면 호스트 카라반 관리 페이지로 리다이렉트합니다.
      router.replace("/host/caravans/manage");
    } else {
      // 로그인되지 않은 상태이면 로그인 페이지로 보냅니다.
      router.replace("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">리다이렉트 중...</p>
        <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
