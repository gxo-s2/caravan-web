'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------
// [내부 컴포넌트] 별점 표시 (SVG)
// ----------------------------------------------------------------------
const StarRating = ({ rating, size = 'md' }: { rating: number, size?: 'sm' | 'md' }) => {
  const starClass = size === 'sm' ? "w-4 h-4" : "w-6 h-6";
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={index <= Math.round(rating) ? "#FBBF24" : "#E5E7EB"} // 노란색 or 회색
          className={starClass}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.005z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// [내부 컴포넌트] 결제 확인 모달
// ----------------------------------------------------------------------
function PaymentModal({ isOpen, onClose, onConfirm, caravanName, startDate, endDate, totalPrice, isProcessing }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-900">결제 확인</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">예약 카라반</p>
            <p className="font-bold text-gray-800">{caravanName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">일정</p>
            <p className="font-medium text-gray-800">{startDate} ~ {endDate}</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-md flex justify-between items-center border border-indigo-100">
            <p className="text-indigo-700 font-medium">총 결제 금액</p>
            <p className="text-2xl font-bold text-indigo-700">{totalPrice.toLocaleString()}원</p>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border rounded-md text-gray-700 font-medium hover:bg-gray-50" disabled={isProcessing}>취소</button>
          <button onClick={onConfirm} disabled={isProcessing} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700 shadow-md">
            {isProcessing ? '처리 중...' : '결제하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// [메인] CaravanDetailPage
// ----------------------------------------------------------------------

interface Caravan {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerDay: number;
  capacity: number;
  images: string[];
  host: { name: string; id: string };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author: { name: string; profilePicture: string | null };
}

export default function CaravanDetailPage() {
  const [id, setId] = useState<string>('');
  const [caravan, setCaravan] = useState<Caravan | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 탭 상태 관리 ('info': 상세정보, 'reviews': 이용후기)
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');

  // 예약 관련 상태
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ID 추출 및 초기 탭 설정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      const caravanId = pathSegments.pop() || pathSegments.pop();
      if (caravanId) setId(caravanId);

      // URL 해시가 #reviews면 후기 탭 활성화
      if (window.location.hash === '#reviews') {
        setActiveTab('reviews');
      }
    }
  }, []);

  // 데이터 불러오기
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. 카라반 정보 조회
        const caravanRes = await axios.get(`http://127.0.0.1:3001/api/caravans/${id}`);
        setCaravan(caravanRes.data);

        // 2. 후기 목록 조회
        try {
          const reviewsRes = await axios.get(`http://127.0.0.1:3001/api/reviews/caravan/${id}`);
          setReviews(reviewsRes.data);
        } catch (reviewErr) {
          console.warn("리뷰를 불러오지 못했습니다:", reviewErr);
          setReviews([]);
        }

      } catch (err: any) {
        console.error("데이터 로딩 실패:", err);
        if (err.response?.status === 404) {
          setError('존재하지 않는 카라반입니다.');
        } else {
          setError('정보를 불러올 수 없습니다. 백엔드 서버를 확인해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ✅ [추가] 로딩 완료 후 해시(#reviews)가 있으면 해당 위치로 자동 스크롤
  useEffect(() => {
    if (!loading && typeof window !== 'undefined' && window.location.hash === '#reviews') {
      const element = document.getElementById('reviews-section');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [loading]);

  // 평점 계산
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
    : 0;

  // 가격 계산
  const calculateTotal = () => {
    if (!caravan || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays * caravan.pricePerDay;
  };

  const handleOpenModal = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('로그인이 필요합니다.');
      if (typeof window !== 'undefined') window.location.href = `${window.location.origin}/auth/login`;
      return;
    }
    if (!startDate || !endDate) return alert('체크인 및 체크아웃 날짜를 선택해주세요.');
    if (calculateTotal() <= 0) return alert('올바른 날짜를 선택해주세요.');
    setIsModalOpen(true);
  };

  const handlePaymentConfirm = async () => {
    setProcessing(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('로그인 정보 없음');
      const user = JSON.parse(userStr);

      const payload = {
        caravanId: id,
        guestId: user.id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: calculateTotal(), 
      };

      await axios.post('http://127.0.0.1:3001/api/reservations', payload);
      setIsModalOpen(false);
      alert('🎉 예약 신청이 완료되었습니다! (호스트 승인 대기)');
      if (typeof window !== 'undefined') window.location.href = `${window.location.origin}/my/reservations`;
    } catch (err: any) {
      alert(`예약 실패: ${err.response?.data?.message || err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500">로딩 중...</div>;
  
  if (error) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">오류 발생</h2>
      <p className="text-red-500 mb-6">{error}</p>
      <a href="/caravans" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
        목록으로 돌아가기
      </a>
    </div>
  );

  if (!caravan) return <div className="p-10 text-center">카라반을 찾을 수 없습니다.</div>;

  const totalPrice = calculateTotal();
  const mainImage = (caravan.images?.[0] && caravan.images[0].startsWith('http'))
    ? caravan.images[0]
    : `https://via.placeholder.com/1200x600?text=${encodeURIComponent(caravan.name)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        caravanName={caravan.name}
        startDate={startDate}
        endDate={endDate}
        totalPrice={totalPrice}
        isProcessing={processing}
      />

      {/* 이미지 섹션 (항상 보임) */}
      <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden mb-8 shadow-md">
        <img src={mainImage} alt={caravan.name} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* 좌측: 정보 및 탭 영역 */}
        {/* ✅ [수정됨] 후기 탭일 때는 좌측 영역을 넓게(3칸 모두) 사용하고, 상세 정보일 때는 2칸 사용 */}
        <div className={activeTab === 'reviews' ? "lg:col-span-3" : "lg:col-span-2"}>
          
          {/* 상단 제목 및 평점 (모든 탭 공통) */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{caravan.name}</h1>
              {/* 평균 별점 */}
              {reviews.length > 0 && (
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-bold text-gray-800">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm ml-1">({reviews.length} reviews)</span>
                </div>
              )}
            </div>
            <p className="text-gray-500 flex items-center mt-1">📍 {caravan.location}</p>
          </div>

          {/* 탭 버튼 */}
          <div className="flex border-b border-gray-200 mt-8 mb-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 pb-3 text-center text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'info' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              상세 정보
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 pb-3 text-center text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'reviews' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              이용 후기 ({reviews.length})
            </button>
          </div>

          {/* ✅ 탭 내용: 상세 정보 */}
          {activeTab === 'info' && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">카라반 소개</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{caravan.description}</p>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">호스트 정보</h2>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {caravan.host?.name?.[0] || 'H'}
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-900 font-medium">{caravan.host?.name || '알 수 없음'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ 탭 내용: 이용 후기 */}
          {activeTab === 'reviews' && (
            <div id="reviews-section" className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  이용 후기 <span className="text-gray-500 font-normal text-base">({reviews.length}개)</span>
                </h2>
                <button 
                  onClick={() => setActiveTab('info')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  ← 상세 정보로 돌아가기
                </button>
              </div>
              
              {reviews.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500">
                  아직 작성된 후기가 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            {review.author.profilePicture ? (
                              <img src={review.author.profilePicture} alt={review.author.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-500 font-bold">{review.author.name[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{review.author.name}</p>
                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed pl-1">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ✅ [수정됨] 우측: 예약 위젯 (상세 정보 탭일 때만 보임) */}
        {activeTab === 'info' && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
              <div className="flex justify-between items-end mb-6">
                <span className="text-2xl font-bold text-gray-900">{caravan.pricePerDay.toLocaleString()}원</span>
                <span className="text-gray-500 mb-1">/ 1박</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">체크인</label>
                  <input type="date" className="w-full p-2 border rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">체크아웃</label>
                  <input type="date" className="w-full p-2 border rounded-md" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <button
                onClick={handleOpenModal}
                disabled={processing || !startDate || !endDate}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md ${
                  processing || !startDate || !endDate ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {processing ? '처리 중...' : '예약 및 결제하기'}
              </button>

              {startDate && endDate && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>{caravan.pricePerDay.toLocaleString()}원 × {Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}박</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 mt-2 pt-2 border-t border-gray-100">
                    <span>총 합계</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}