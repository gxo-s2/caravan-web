'use client';

import { useState } from 'react';
import axios from 'axios';
// next/link, next/navigation 대신 표준 a 태그와 window.location 사용

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    // 기본 역할은 GUEST로 설정
    role: 'GUEST', 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. 회원가입 요청
      const res = await axios.post('http://127.0.0.1:3001/api/users/signup', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      });

      if (res.status === 201) {
        alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
        // 2. 로그인 페이지로 이동
        if (typeof window !== 'undefined') {
          window.location.href = `${window.location.origin}/auth/login`;
        }
      } else {
        throw new Error(res.data?.message || '회원가입에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('회원가입 오류:', err);
      // 서버에서 온 에러 메시지를 표시
      setError(err.response?.data?.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          CaravanApp 계정을 만드세요.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 이름 입력 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일 주소</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* 역할 선택 */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">계정 유형</label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="GUEST">게스트 (여행자)</option>
                <option value="HOST">호스트 (카라반 주인)</option>
              </select>
            </div>


            {/* 제출 버튼 */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? '처리 중...' : '회원가입 완료'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              로그인하기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}