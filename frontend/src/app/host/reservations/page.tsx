"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// 타입 정의
interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  guest: { id: string; name: string; email: string };
  caravan: { id: string; name: string };
  payment: { status: 'COMPLETED' | 'REFUNDED' }[];
  createdAt: string;
}

// 상태 뱃지 컴포넌트
const StatusBadge = ({ status }: { status: Reservation['status'] }) => {
  const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
  switch (status) {
    case 'PENDING':
      return <span className={`${baseClasses} bg-yellow-200 text-yellow-800`}>승인 대기</span>;
    case 'CONFIRMED':
      return <span className={`${baseClasses} bg-green-200 text-green-800`}>예약 확정</span>;
    case 'CANCELLED':
      return <span className={`${baseClasses} bg-red-200 text-red-800`}>취소됨</span>;
    default:
      return <span className={`${baseClasses} bg-gray-200 text-gray-800`}>알 수 없음</span>;
  }
};

export default function HostReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null); // 승인/거절 처리 중인 ID
  const router = useRouter();

  // 호스트 정보 가져오기 (localStorage)
  const getHostId = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).id : null;
  };

  useEffect(() => {
    const hostId = getHostId();
    if (!hostId) {
      alert('호스트로 로그인해야 합니다.');
      router.push('/auth/login');
      return;
    }

    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/reservations/host/${hostId}`);
        setReservations(response.data);
      } catch (err) {
        console.error("예약 목록 로딩 실패:", err);
        setError('예약 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [router]);

  // 예약 상태 변경 핸들러 (승인/거절)
  const handleUpdateStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    const actionText = status === 'CONFIRMED' ? '승인' : '거절';
    if (!confirm(`이 예약을 정말 ${actionText}하시겠습니까?`)) return;

    setProcessingId(id);
    try {
      await axios.patch(`http://localhost:3001/api/reservations/${id}/status`, { status });
      
      // 상태 변경 성공 시 UI 업데이트
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      );
      alert(`예약이 ${actionText}되었습니다.`);

    } catch (err) {
      console.error(`예약 ${actionText} 처리 실패:`, err);
      alert(`처리 중 오류가 발생했습니다.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-6 text-center">예약 목록을 불러오는 중...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">내 카라반 예약 관리</h1>
      
      {reservations.length === 0 ? (
        <p className="text-center text-gray-500 py-10">아직 받은 예약이 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {reservations.map(reservation => (
            <div key={reservation.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{reservation.caravan.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">게스트: {reservation.guest.name} ({reservation.guest.email})</p>
                  </div>
                  <StatusBadge status={reservation.status} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">체크인</p>
                    <p className="font-medium text-gray-900">{new Date(reservation.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">체크아웃</p>
                    <p className="font-medium text-gray-900">{new Date(reservation.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">결제 금액</p>
                    <p className="font-medium text-gray-900">₩{reservation.totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* PENDING 상태일 때만 버튼 노출 */}
                {reservation.status === 'PENDING' && (
                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      onClick={() => handleUpdateStatus(reservation.id, 'CONFIRMED')}
                      disabled={processingId === reservation.id}
                      className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {processingId === reservation.id ? '처리중...' : '승인'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(reservation.id, 'CANCELLED')}
                      disabled={processingId === reservation.id}
                      className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {processingId === reservation.id ? '처리중...' : '거절'}
                    </button>
                  </div>
                )}
              </div>
              {reservation.status === 'CANCELLED' && reservation.payment[0]?.status === 'REFUNDED' && (
                 <div className="bg-red-50 px-6 py-2 text-center text-sm font-medium text-red-700">
                   게스트에게 환불 처리되었습니다.
                 </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
