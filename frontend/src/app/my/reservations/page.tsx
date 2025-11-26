'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------
// [통합] ReviewModal 컴포넌트 (내부 정의)
// ----------------------------------------------------------------------

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caravanId: string;
  caravanName: string;
  onSuccess: () => void;
}

function ReviewModal({ isOpen, onClose, caravanId, caravanName, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return alert('로그인이 필요합니다.');
    const user = JSON.parse(userStr);

    if (!comment.trim()) {
      return alert('후기 내용을 입력해주세요.');
    }

    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:3001/api/reviews', {
        authorId: user.id,
        caravanId,
        rating,
        comment,
      });
      
      alert('소중한 리뷰가 등록되었습니다!');
      onSuccess(); 
      onClose();   
    } catch (error: any) {
      console.error('리뷰 등록 실패:', error);
      alert(error.response?.data?.message || '리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 별 아이콘 (SVG)
  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8"
    >
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.326 1.163l-4.304 3.86a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.304-3.86a.562.562 0 01.326-1.163l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4 animate-fade-in-up">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">리뷰 작성</h3>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-indigo-600 text-base block mb-1">{caravanName}</span>
            여행은 어떠셨나요? 솔직한 후기를 들려주세요.
          </p>
        </div>
        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              type="button"
              className={`transition-transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
            >
              <StarIcon filled={star <= rating} />
            </button>
          ))}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">상세 후기</label>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-32 text-sm bg-gray-50"
            placeholder="좋았던 점, 아쉬웠던 점을 자유롭게 적어주세요..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">취소</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-md transition-colors disabled:bg-indigo-400">{loading ? '등록 중...' : '리뷰 등록하기'}</button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// [메인] MyReservationsPage 컴포넌트
// ----------------------------------------------------------------------

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  caravan: {
    id: string;
    name: string;
    location: string;
    images: string[];
  };
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('로그인이 필요합니다.');
        if (typeof window !== 'undefined') {
          window.location.href = `${window.location.origin}/auth/login`;
        }
        return;
      }
      const user = JSON.parse(userStr);
      const response = await axios.get(`http://127.0.0.1:3001/api/reservations/user/${user.id}`);
      setReservations(response.data);
    } catch (err: any) {
      console.error('예약 불러오기 실패:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('백엔드 서버(3001)가 꺼져 있어 연결할 수 없습니다.');
      } else {
        setError('예약 내역을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // 예약 번호 복사
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      alert(`예약 번호가 복사되었습니다.\n${id}`);
    });
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm('정말로 예약을 취소하시겠습니까?\n취소 시 환불 정책에 따라 처리됩니다.')) return;
    try {
      await axios.patch(`http://127.0.0.1:3001/api/reservations/${reservationId}/status`, {
        status: 'CANCELLED',
      });
      alert('예약이 취소되었습니다.');
      fetchReservations(); 
    } catch (err) {
      console.error(err);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };

  const openReviewModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsReviewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  if (loading) return <div className="p-10 text-center text-gray-500">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">내 예약 목록</h1>

      {error && (
        <div className="text-center py-20 bg-red-50 rounded-lg border border-red-100">
          <p className="text-red-500 font-bold mb-2">⚠️ 오류 발생</p>
          <p className="text-gray-600">{error}</p>
          <button onClick={fetchReservations} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">다시 시도</button>
        </div>
      )}

      {reservations.length === 0 && !error ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-6 text-lg">아직 예약된 여행이 없습니다.</p>
          <a href="/caravans" className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
            카라반 보러가기
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((res) => {
            const endDate = new Date(res.endDate);
            const now = new Date();
            const isCompleted = now >= endDate && res.status === 'CONFIRMED';

            // 상태별 뱃지 스타일
            let badgeStyle = "bg-gray-100 text-gray-600";
            let badgeText = "알 수 없음";

            if (res.status === 'PENDING') {
              badgeStyle = "bg-yellow-100 text-yellow-800 border border-yellow-200";
              badgeText = "예약 대기";
            } else if (res.status === 'CANCELLED') {
              badgeStyle = "bg-red-50 text-red-600 border border-red-100";
              badgeText = "취소됨";
            } else if (res.status === 'CONFIRMED') {
              if (isCompleted) {
                badgeStyle = "bg-blue-50 text-blue-700 border border-blue-200";
                badgeText = "이용 완료";
              } else {
                badgeStyle = "bg-green-50 text-green-700 border border-green-200";
                badgeText = "예약 확정";
              }
            }

            return (
              <div key={res.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  
                  {/* 예약 정보 */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{res.caravan.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
                        {badgeText}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {res.caravan.location}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div>
                        <span className="block text-xs text-gray-400 mb-1">체크인</span>
                        <span className="font-medium text-gray-800">{formatDate(res.startDate)}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-400 mb-1">체크아웃</span>
                        <span className="font-medium text-gray-800">{formatDate(res.endDate)}</span>
                      </div>
                      <div className="col-span-2 md:col-span-1 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-0 border-gray-200">
                        <span className="block text-xs text-gray-400 mb-1">결제 금액</span>
                        <span className="font-bold text-indigo-600 text-lg">{formatPrice(res.totalPrice)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center text-xs text-gray-400">
                      <span className="mr-2">예약 번호: {res.id}</span>
                      <button onClick={() => handleCopyId(res.id)} className="text-indigo-500 hover:underline">복사</button>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="w-full md:w-auto flex justify-end">
                    {isCompleted && (
                      <button 
                        onClick={() => openReviewModal(res)}
                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        리뷰 쓰기
                      </button>
                    )}
                    {(res.status === 'PENDING' || (res.status === 'CONFIRMED' && !isCompleted)) && (
                      <button 
                        onClick={() => handleCancelReservation(res.id)}
                        className="px-5 py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition shadow-sm"
                      >
                        예약 취소
                      </button>
                    )}
                    {res.status === 'CANCELLED' && (
                      <span className="px-5 py-2.5 bg-gray-100 text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed border border-gray-200">
                        취소 완료
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 리뷰 작성 모달 */}
      {selectedReservation && (
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          caravanId={selectedReservation.caravan.id}
          caravanName={selectedReservation.caravan.name}
          onSuccess={fetchReservations}
        />
      )}
    </div>
  );
}