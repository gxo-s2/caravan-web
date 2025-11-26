'use client';

import { useEffect, useState } from 'react';

// 유저 타입 정의
type User = {
  id: string;
  name?: string;
  role?: string; // 'GUEST' | 'HOST'
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 로컬 스토리지 접근
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(!!parsedUser);
      } catch (e) {
        console.error("유저 정보 파싱 실패", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      window.location.href = `${window.location.origin}/`;
    }
  };

  const handleReservationLookupClick = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      // 로그인 상태라면 내 예약 페이지로, 아니면 조회 페이지로
      if (isLoggedIn) {
        window.location.href = `${origin}/my/reservations`;
      } else {
        window.location.href = `${origin}/reservations/lookup`;
      }
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* 왼쪽: 로고 및 메인 메뉴 */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">
                CaravanApp
              </span>
            </a>

            <div className="hidden sm:flex sm:space-x-8">
              <a
                href="/caravans"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium transition-colors"
              >
                Explore Caravans
              </a>
              
              {/* ✅ [수정됨] 게스트(GUEST)가 아닐 때만 '예약 조회' 버튼 표시 */}
              {/* 비회원(user가 null)이거나, 호스트(HOST)일 때만 보입니다. */}
              {user?.role !== 'GUEST' && (
                <button
                  onClick={handleReservationLookupClick}
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium transition-colors focus:outline-none"
                >
                  예약 조회
                </button>
              )}

              {/* 호스트 전용 메뉴: 카라반 목록 */}
              {user?.role === 'HOST' && (
                <a
                  href="/host/caravans/manage"
                  className="text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-800 text-sm font-bold transition-colors"
                >
                  카라반 목록
                </a>
              )}
            </div>
          </div>

          {/* 오른쪽: 유저 메뉴 */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* 결제 내역 링크 */}
                <a
                  href="/my/payments"
                  className="hidden md:inline-flex items-center text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  결제 내역
                </a>

                <a
                  href="/my/reservations"
                  className="hidden md:inline-block text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  내 예약
                </a>
                <a
                  href="/my/profile"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  내 프로필
                </a>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <a
                href="/auth/login"
                className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
              >
                로그인
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}