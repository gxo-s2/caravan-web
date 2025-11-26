'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// 타입 경로가 맞는지 확인해주세요. (만약 파일이 없다면 아래 주석을 풀고 로컬에 정의하세요)
import { Role } from '../../../types/backend-enums'; 

// Vercel 환경 변수에서 API 기본 경로를 가져옵니다. 
// Vercel에서 NEXT_PUBLIC_API_BASE_URL을 '/api'로 설정했습니다.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// 만약 위 import가 안 된다면 아래 주석을 풀어서 사용하세요.
// enum Role {
//   HOST = 'HOST',
//   GUEST = 'GUEST',
// }

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // 초기값을 명확하게 Role.GUEST로 설정
  const [role, setRole] = useState<Role>(Role.GUEST); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('회원가입 요청 데이터:', { email, password, name, role });

      // ⭐ 수정된 부분: 하드코딩된 로컬 주소 대신 환경 변수를 사용합니다.
      // Vercel에서는 '/api/users/signup' 경로를 사용합니다.
      const url = `${API_BASE_URL}/users/signup`; 
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 서버에서 오는 에러 메시지를 사용자에게 표시합니다.
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      // alert() 대신 Vercel 환경에서 안전한 대체 UI를 사용하는 것이 권장되지만, 
      // 현재 로컬 개발 환경과의 일관성을 위해 일단 유지합니다.
      alert('회원가입이 완료되었습니다! 로그인 해주세요.'); 
      router.push('/auth/login'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || '알 수 없는 오류가 발생했습니다. (DB 연결 또는 서버 에러 확인 필요)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 이름 입력 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 역할 선택 (라디오 버튼) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Register as:</label>
            <div className="mt-2 flex space-x-4">
              
              {/* Guest 선택 */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === Role.GUEST}
                  onChange={() => setRole(Role.GUEST)} // 직접 값을 설정
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Guest</span>
              </label>

              {/* Host 선택 */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === Role.HOST}
                  onChange={() => setRole(Role.HOST)} // 직접 값을 설정
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Host</span>
              </label>

            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : '회원가입 완료'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}