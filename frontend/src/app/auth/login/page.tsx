'use client';

import { useState } from 'react';
import axios from 'axios';
// import Link from 'next/link'; // a 태그 사용을 위해 주석 처리

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🔐 스마트 간편 로그인 핸들러
  const handleLogin = async (role: 'GUEST' | 'HOST') => {
    setLoading(true);
    setError('');

    const credentials = {
      email: role === 'GUEST' ? 'guest@test.com' : 'host@test.com',
      password: 'password123',
      name: role === 'GUEST' ? '테스트 게스트' : '테스트 호스트',
      role: role,
    };

    try {
      let user;

      // 1. 회원가입 시도
      try {
        const signupRes = await axios.post('http://127.0.0.1:3001/api/users/signup', credentials);
        user = signupRes.data;
      } catch (err: any) {
        // 2. 이미 존재하는 계정(409 Conflict)이라면 -> 로그인 시도
        if (err.response && err.response.status === 409) {
          const loginRes = await axios.post('http://127.0.0.1:3001/api/users/login', {
            email: credentials.email,
            password: credentials.password,
          });
          user = loginRes.data;
        } else {
          throw err;
        }
      }

      // 3. 유저 정보 저장 및 이동
      if (user && user.id) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/';
      } else {
        throw new Error('유저 정보를 받아오지 못했습니다.');
      }

    } catch (err: any) {
      setError(err.response?.data?.message || '로그인 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이메일/비밀번호 로그인 핸들러 (직접 입력)
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://127.0.0.1:3001/api/users/login', {
        email,
        password,
      });

      const user = res.data;
      
      if (user && user.id) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/';
      } else {
        throw new Error('유저 정보를 받아오지 못했습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          CaravanApp 로그인
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          간편 로그인
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-6">


            {/* 이메일 로그인 폼 */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                로그인
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">계정이 없으신가요?</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <a
                  // ✅ [수정됨] /register 대신 /auth/register로 변경
                  href="/auth/register"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  회원가입 하기
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}