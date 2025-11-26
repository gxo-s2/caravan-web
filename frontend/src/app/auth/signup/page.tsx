'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Canvas 컴파일 오류로 주석 처리
// import { Link } from 'next/link'; // Canvas 컴파일 오류로 주석 처리
import axios from 'axios'; // 🚨 Axios 라이브러리 추가

// 🚨🚨🚨 최종 수정: Render 주소를 가져옵니다. 🚨🚨🚨
// typeof process !== 'undefined' 검사를 통해 Node 환경이 아닌 곳에서의 오류를 방지합니다.
const API_BASE_URL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) || '';

// 💡 오류 해결: 경로 문제를 우회하기 위해 Role 타입을 여기에 직접 정의합니다.
enum Role {
    HOST = 'HOST',
    GUEST = 'GUEST',
}

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>(Role.GUEST); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // 임시 useRouter 및 Link 대체 함수 (Canvas에서 컴파일 가능하도록)
    const router = { push: (path: string) => console.log('Navigate to:', path) };
    const Link = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
        <a href={href} className={className} onClick={(e) => { e.preventDefault(); router.push(href); }}>{children}</a>
    );


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!API_BASE_URL) {
            setError('API 기본 경로가 설정되지 않았습니다. Vercel 환경 변수를 확인해주세요.');
            setLoading(false);
            return;
        }

        try {
            console.log('회원가입 요청 데이터:', { email, password, name, role });

            // API_BASE_URL은 Render 주소입니다.
            const url = `${API_BASE_URL}/api/users/signup`; 
            
            // 🚨🚨🚨 fetch 대신 axios.post 사용 🚨🚨🚨
            const res = await axios.post(url, {
                email, password, name, role
            });

            alert('회원가입이 완료되었습니다! 로그인 해주세요.'); 
            // 실제 Next.js 환경에서는 router.push('/auth/login'); 으로 이동합니다.
            router.push('/auth/login'); 
            
        } catch (err: any) {
             // Axios 에러 처리 (네트워크 오류, 서버 오류 분리)
            console.error(err);
            if (err.response) {
                // 서버로부터 응답을 받은 경우 (400, 500 에러 등)
                setError(err.response.data.message || '회원가입에 실패했습니다. (서버 응답 오류)');
            } else if (err.request) {
                // 요청은 보냈으나 응답을 받지 못한 경우 (네트워크 오류, CORS 등)
                setError('서버에 연결할 수 없습니다. 백엔드(Render) 상태를 확인해주세요.');
            } else {
                // 기타 오류
                setError(err.message || '알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">CaravanApp 계정을 만드세요</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* 에러 메시지 표시 */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm font-bold" role="alert">
                            {error}
                        </div>
                    )}

                    {/* 이름 입력 */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            이름
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="홍길동"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* 이메일 입력 */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            이메일 주소
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
                            비밀번호
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
                        <label className="block text-sm font-medium text-gray-700">계정 유형</label>
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
                                <span className="ml-2 text-sm text-gray-600">게스트 (카라반 이용자)</span>
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
                                <span className="ml-2 text-sm text-gray-600">호스트 (카라반 주인)</span>
                            </label>

                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                        disabled={loading}
                    >
                        {loading ? '회원가입 중...' : '회원가입 완료'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    이미 계정이 있으신가요?{' '}
                    <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        로그인하기
                    </Link>
                </p>
            </div>
        </main>
    );
}