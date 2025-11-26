'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
// next/navigation 모듈 오류 방지를 위해 window.location 사용
// import { useRouter } from 'next/navigation'; 
// next/link 모듈 오류 방지를 위해 a 태그 사용
// import Link from 'next/link';

export default function NewCaravanPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    pricePerDay: '',
    capacity: '',
    description: '',
    imageUrls: '', // 쉼표로 구분하여 입력
  });

  // 호스트 권한 체크 (페이지 진입 시)
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('로그인이 필요합니다.');
      if (typeof window !== 'undefined') {
        window.location.href = `${window.location.origin}/auth/login`;
      }
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'HOST') {
      alert('호스트 권한이 필요합니다.');
      if (typeof window !== 'undefined') {
        window.location.href = `${window.location.origin}/`;
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 로컬 스토리지에서 호스트 ID 가져오기
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('로그인 정보가 없습니다.');
      const user = JSON.parse(userStr);

      // 데이터 가공
      const payload = {
        hostId: user.id,
        name: formData.name,
        location: formData.location,
        pricePerDay: Number(formData.pricePerDay),
        capacity: Number(formData.capacity),
        description: formData.description,
        // 쉼표로 구분된 이미지 URL을 배열로 변환 및 공백 제거
        images: formData.imageUrls.split(',').map((url) => url.trim()).filter((url) => url !== ''),
      };

      // 백엔드 요청
      const response = await axios.post('/api/caravans', payload);

      if (response.status === 201) {
        alert('카라반이 성공적으로 등록되었습니다!');
        if (typeof window !== 'undefined') {
          window.location.href = `${window.location.origin}/my/profile`; // 등록 후 내 프로필이나 목록으로 이동
        }
      }
    } catch (err: any) {
      console.error('등록 실패:', err);
      // 에러 메시지가 객체일 경우를 대비해 문자열로 변환
      const errorMsg = err.response?.data?.message;
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) || '카라반 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">새 카라반 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        
        {/* 카라반 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">카라반 이름</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="예: 숲속 힐링 캠핑카"
          />
        </div>

        {/* 위치 */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">위치 (지역)</label>
          <input
            type="text"
            name="location"
            id="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="예: 강원도 춘천"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1박 가격 */}
          <div>
            <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">1박 요금 (원)</label>
            <input
              type="number"
              name="pricePerDay"
              id="pricePerDay"
              required
              min="0"
              value={formData.pricePerDay}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="50000"
            />
          </div>

          {/* 수용 인원 */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">최대 수용 인원 (명)</label>
            <input
              type="number"
              name="capacity"
              id="capacity"
              required
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
              placeholder="4"
            />
          </div>
        </div>

        {/* 설명 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">상세 설명</label>
          <textarea
            name="description"
            id="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="카라반의 특징과 장점을 설명해주세요."
          />
        </div>

        {/* 이미지 URL */}
        <div>
          <label htmlFor="imageUrls" className="block text-sm font-medium text-gray-700">이미지 URL (콤마로 구분)</label>
          <input
            type="text"
            name="imageUrls"
            id="imageUrls"
            required
            value={formData.imageUrls}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            * 실제 이미지 파일 업로드는 추후 구현 예정입니다. 현재는 이미지 주소를 입력해주세요.
            (테스트용: https://placehold.co/600x400)
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
            ⚠️ {error}
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mr-3 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? '등록 중...' : '카라반 등록하기'}
          </button>
        </div>

      </form>
    </div>
  );
}
