'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ReservationSuccessPage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get('reservationId');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-lg w-full">
        <svg
          className="w-20 h-20 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          예약이 완료되었습니다!
        </h1>
        <p className="text-gray-600 mb-6">
          성공적으로 결제가 처리되었으며, 예약이 확정되었습니다.
        </p>
        {reservationId && (
          <div className="bg-gray-100 rounded-lg px-4 py-3 mb-8 text-sm text-gray-700">
            <p>예약 번호: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{reservationId}</span></p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/my/reservations"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            내 예약 확인하기
          </Link>
          <Link
            href="/caravans"
            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            다른 카라반 둘러보기
          </Link>
        </div>
      </div>
    </main>
  );
}