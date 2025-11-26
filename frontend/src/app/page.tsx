'use client';

import { useEffect, useState } from 'react';
// import Link from 'next/link'; // 오류 방지를 위해 제거
import axios from 'axios';
// import { useRouter } from 'next/navigation'; // 오류 방지를 위해 제거

// --- TYPE DEFINITIONS ---
interface User {
  id: string;
  name: string;
  role: 'GUEST' | 'HOST';
}

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  caravan: { name: string };
  guest: { name: string };
}

// --- STATUS BADGE COMPONENT ---
const StatusBadge = ({ status }: { status: Reservation['status'] }) => {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  const text = {
    PENDING: '대기중',
    CONFIRMED: '승인됨',
    CANCELLED: '거절/취소됨',
  };
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {text[status]}
    </span>
  );
};

// --- GUEST LANDING PAGE (Design Upgraded) ---
const GuestLandingPage = () => (
  <main className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden">
    {/* 배경 이미지 및 그라데이션 오버레이 */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        alt="Caravan Adventure" 
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
    </div>

    {/* 메인 콘텐츠 */}
    <div className="relative z-10 text-center space-y-8 max-w-5xl px-6 animate-fade-in-up">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl">
        Find Your Next <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Adventure on Wheels
        </span>
      </h1>
      
      <p className="text-lg md:text-2xl text-gray-200 leading-relaxed mx-auto max-w-3xl font-light drop-shadow-md">
        전 세계의 믿을 수 있는 호스트가 제공하는 독특한 카라반을 만나보세요.<br className="hidden md:block"/> 
        당신만의 특별한 여행이 기다리고 있습니다.
      </p>
      
      <div className="pt-10 flex justify-center gap-4">
        <a 
          href="/caravans" 
          className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl backdrop-blur-sm bg-opacity-90 border border-indigo-500/30"
        >
          Explore Caravans ➜
        </a>
      </div>
    </div>

    {/* 하단 장식 요소 */}
    <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10 animate-bounce">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </main>
);

// --- HOST DASHBOARD ---
const HostDashboard = ({ user }: { user: User }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // useRouter() 대신 window.location 사용
  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `${window.location.origin}${path}`;
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:3001/api/reservations/host/${user.id}`);
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchReservations();
    }
  }, [user.id]);

  const handleUpdateStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      await axios.patch(`http://127.0.0.1:3001/api/reservations/${id}/status`, { status });
      alert(`예약이 ${status === 'CONFIRMED' ? '승인' : '거절'}되었습니다.`);
      fetchReservations(); // Refresh the list
    } catch (error) {
      console.error("Failed to update reservation status", error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          안녕하세요, {user.name} 호스트님! 👋
        </h1>
        <button 
          onClick={() => navigate('/caravans/new')}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm"
        >
          + 새 카라반 등록
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">내 카라반 예약 요청 목록</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500">예약 목록을 불러오는 중...</div>
        ) : reservations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">아직 들어온 예약 요청이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">카라반 / 게스트</th>
                  <th className="px-6 py-3">일정</th>
                  <th className="px-6 py-3">금액</th>
                  <th className="px-6 py-3">상태</th>
                  <th className="px-6 py-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservations.map(res => (
                  <tr key={res.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{res.caravan.name}</td>
                    <td className="px-6 py-4">{res.guest.name}</td>
                    <td className="px-6 py-4">{formatDate(res.startDate)} - {formatDate(res.endDate)}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">₩{res.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={res.status} /></td>
                    <td className="px-6 py-4 text-right">
                      {res.status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(res.id, 'CONFIRMED')} 
                            className="text-green-600 hover:text-green-800 font-medium border border-green-200 px-3 py-1 rounded hover:bg-green-50 transition-colors"
                          >
                            승인
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(res.id, 'CANCELLED')} 
                            className="text-red-600 hover:text-red-800 font-medium border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            거절
                          </button>
                        </div>
                      )}
                      {res.status === 'CONFIRMED' && (
                         <button 
                           onClick={() => handleUpdateStatus(res.id, 'CANCELLED')} 
                           className="text-gray-400 hover:text-red-600 text-xs underline"
                         >
                           취소하기
                         </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN HOME PAGE (Controller) ---
export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;
  }

  if (user && user.role === 'HOST') {
    return <HostDashboard user={user} />;
  }

  return <GuestLandingPage />;
}