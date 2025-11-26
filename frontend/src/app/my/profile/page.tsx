'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// 💡 오류 해결: 경로 문제를 우회하기 위해 Role 타입을 여기에 직접 정의합니다.
enum Role {
    HOST = 'HOST',
    GUEST = 'GUEST',
}

interface UserProfile {
    id: string;
    email: string;
    name: string;
    contactNumber: string;
    role: Role;
    isVerified: boolean;
    rating: number; // 평가 항목 추가 (프론트엔드 목업)
}

export default function ProfilePage() {
    // const router = useRouter();
    const router = { push: (path: string) => console.log('Navigate to:', path) };
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});

    useEffect(() => {
        // 1. localStorage에서 사용자 정보 로드
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            alert("로그인이 필요합니다.");
            router.push("/auth/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        
        // 목업 데이터로 평가, 연락처, 신원 확인 정보를 추가
        const mockProfile: UserProfile = {
            ...parsedUser,
            contactNumber: parsedUser.contactNumber || '010-1234-5678',
            rating: parsedUser.rating || 4.5, // 평가 (1-5점)
            isVerified: parsedUser.isVerified || (parsedUser.role === Role.HOST), // 호스트는 인증되었다고 가정
            
        };

        setProfile(mockProfile);
        setFormData(mockProfile);
        setLoading(false);
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // 🚨 실제 백엔드 API (PUT /api/users/[id]) 호출 로직은 여기에 구현해야 합니다. 🚨
        // axios를 사용하여 Render 백엔드 API로 업데이트 요청을 보내야 합니다.
        
        console.log("Saving profile data:", formData);
        
        // localStorage 업데이트 시뮬레이션
        localStorage.setItem("user", JSON.stringify(formData)); 

        setProfile(formData as UserProfile);
        setIsEditing(false);
        // alert() 대신 커스텀 모달 UI를 사용해야 하지만, 현재는 테스트 목적으로 alert를 사용합니다.
        alert("프로필 정보가 저장되었습니다.");
    };

    if (loading || !profile) {
        return <div className="flex justify-center items-center h-screen text-gray-600">프로필 로딩 중...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
            <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-2">
                내 프로필 관리
            </h1>
            
            <form onSubmit={handleSave}>
                <div className="space-y-6">
                    {/* 사용자 역할 및 평가 */}
                    <div className="flex items-center space-x-4">
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${profile.role === Role.HOST ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                            {profile.role === Role.HOST ? '호스트 (카라반 주인)' : '게스트 (일반 이용자)'}
                        </span>
                        <div className="flex items-center text-yellow-500">
                            <svg className="w-5 h-5 fill-current mr-1" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            <span className="text-gray-700 font-medium">{profile.rating.toFixed(1)} / 5.0</span>
                        </div>
                        {profile.isVerified && (
                             <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">
                                신원 확인 완료
                            </span>
                        )}
                    </div>

                    {/* 이름 */}
                    <div className="border p-4 rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-500">이름</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                                required
                            />
                        ) : (
                            <p className="mt-1 text-lg font-semibold text-gray-800">{profile.name}</p>
                        )}
                    </div>

                    {/* 이메일 (읽기 전용) */}
                    <div className="border p-4 rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-500">이메일 (ID)</label>
                        <p className="mt-1 text-lg font-semibold text-gray-800">{profile.email}</p>
                    </div>

                    {/* 연락처 */}
                    <div className="border p-4 rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-500">연락처</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                            />
                        ) : (
                            <p className="mt-1 text-lg font-semibold text-gray-800">{profile.contactNumber}</p>
                        )}
                    </div>

                    {/* 신원 확인 상태 (추가 필드) */}
                    <div className="border p-4 rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-500">신원 확인 상태</label>
                        <p className="mt-1 text-lg font-semibold text-gray-800">
                            {profile.isVerified ? '인증됨' : '미인증 (호스트 활동을 위해 필수)'}
                        </p>
                    </div>
                </div>

                {/* 버튼 섹션 */}
                <div className="mt-8 flex justify-end space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={() => { setIsEditing(false); setFormData(profile); }}
                                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                변경 사항 저장
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            프로필 수정
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
