'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

// 카라반 데이터 타입 정의
interface Caravan {
  id: string;
  name: string;
  location: string;
  pricePerDay: number;
  images: string[];
}

export default function CaravansPage() {
  const [caravans, setCaravans] = useState<Caravan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCaravans = async () => {
      try {
        // 127.0.0.1로 백엔드 연결
        const response = await axios.get('http://127.0.0.1:3001/api/caravans');
        setCaravans(response.data);
      } catch (err) {
        console.error('카라반 목록 로딩 실패:', err);
        setError('카라반 목록을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaravans();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Explore Our Caravans</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {caravans.map((caravan) => (
          <div key={caravan.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
            
            {/* 이미지 영역 */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={caravan.images?.[0] || `https://via.placeholder.com/400x300?text=${encodeURIComponent(caravan.name)}`}
                alt={caravan.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 정보 영역 */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{caravan.name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {caravan.location}
              </p>

              <div className="mt-auto">
                <div className="flex items-baseline mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(caravan.pricePerDay)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ 1박</span>
                </div>

                {/* ✅ [수정됨] 버튼 영역: 앵커(#) 추가 */}
                <div className="flex gap-3">
                  {/* 예약하기 버튼 -> 상세 페이지 상단으로 */}
                  <a
                    href={`/caravans/${caravan.id}`}
                    className="flex-1 bg-indigo-600 text-white text-center py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
                  >
                    예약하기
                  </a>
                  
                  {/* 후기 버튼 -> 상세 페이지 후기 섹션(#reviews)으로 */}
                  <a
                    href={`/caravans/${caravan.id}#reviews`}
                    className="flex-1 border border-gray-300 text-gray-700 text-center py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    후기
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}