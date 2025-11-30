"use client";

import { useState, useEffect, use } from 'react'; // 'use' 추가됨 (Next.js 15 필수)
import { useRouter } from 'next/navigation'; 

// API URL 환경 변수 처리
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Next.js 15부터 params는 Promise입니다.
type EditCaravanPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditCaravanPage({ params }: EditCaravanPageProps) {
  // 1. Next.js 15 해결: use() 훅을 사용해 params의 포장을 풉니다.
  const { id } = use(params);
  
  const router = useRouter();
  
  // 2. TypeScript 오류 해결: <any>를 사용하여 임시로 타입 검사를 우회합니다.
  // (나중에 types/caravan.ts 파일에 capacity 등을 정식으로 추가하면 <any>를 지우셔도 됩니다)
  const [caravan, setCaravan] = useState<any>({
    name: '',
    location: '',
    pricePerDay: 0,
    description: '',
    capacity: 0,
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCaravanData = async () => {
      try {
        setLoading(true);
        // 백엔드 API 호출
        const response = await fetch(`${API_URL}/caravans/${id}`);
        
        if (!response.ok) {
          throw new Error('카라반 정보를 불러오는 데 실패했습니다.');
        }
        
        const data = await response.json();
        
        setCaravan({
            ...data,
            pricePerDay: data.pricePerDay || 0, 
            capacity: data.capacity || 0,
            // images가 null일 경우 빈 배열로 처리
            images: data.images || []
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCaravanData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // pricePerDay와 capacity는 숫자 타입으로 변환
    const isNumericField = name === 'pricePerDay' || name === 'capacity';
    
    setCaravan((prev: any) => ({
      ...prev,
      [name]: isNumericField ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/caravans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caravan),
      });

      if (!response.ok) {
        throw new Error('카라반 정보 수정에 실패했습니다.');
      }
      
      alert('카라반 정보가 성공적으로 수정되었습니다.');
      // 수정 완료 후 목록 페이지로 이동
      router.push('http://localhost:3000/host/caravans/manage'); 
      router.refresh(); 
    } catch (err: any) {
      setError(err.message);
      alert(err.message);
    }
  };
  
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">카라반 정보 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={caravan.name || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">지역</label>
          <input
            type="text"
            id="location"
            name="location"
            value={caravan.location || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">일일 가격 (원)</label>
          <input
            type="number"
            id="pricePerDay"
            name="pricePerDay"
            value={caravan.pricePerDay || 0}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">수용 인원</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={caravan.capacity || 0}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">설명</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={caravan.description || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">이미지</label>
          {/* 배열인지 확인하고 join 사용 */}
          <p className="text-sm text-gray-500">
             {Array.isArray(caravan.images) ? caravan.images.join(', ') : '이미지 없음'}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          수정 완료
        </button>
      </form>
    </div>
  );
}
