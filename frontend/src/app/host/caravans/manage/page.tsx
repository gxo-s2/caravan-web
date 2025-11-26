"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- 타입 정의 ---
interface Caravan {
  id: string;
  name: string;
  pricePerDay: number;
  location: string;
}

interface User {
  id: string;
  role: 'HOST' | 'GUEST';
}

export default function ManageCaravansPage() {
  const [caravans, setCaravans] = useState<Caravan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null); // 삭제 처리 중인 ID
  const router = useRouter();

  // 1. 사용자 정보 로드 및 호스트 여부 확인
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'HOST') {
        alert('호스트만 접근할 수 있는 페이지입니다.');
        router.push('/');
      } else {
        setUser(parsedUser);
      }
    } else {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
    }
  }, [router]);

  // 2. 호스트의 카라반 목록 불러오기
  useEffect(() => {
    if (user?.id) {
      const fetchCaravans = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3001/api/caravans/host/${user.id}`);
          setCaravans(response.data);
          setError(null);
        } catch (err) {
          console.error("카라반 목록 로딩 실패:", err);
          setError('카라반 목록을 불러오는 데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchCaravans();
    }
  }, [user]);

  // 3. 카라반 삭제 핸들러
  const handleDelete = async (caravanId: string) => {
    if (!confirm("정말로 이 카라반을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) return;

    setProcessingId(caravanId);
    try {
      await axios.delete(`http://localhost:3001/api/caravans/${caravanId}`);
      alert('카라반이 성공적으로 삭제되었습니다.');
      // 삭제 성공 시 목록에서 해당 아이템 제거하여 UI 업데이트
      setCaravans(prev => prev.filter(c => c.id !== caravanId));
    } catch (err: any) {
      console.error("카라반 삭제 실패:", err);
      alert(err.response?.data?.message || '카라반 삭제 중 오류가 발생했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) {
    return <div className="p-6 text-center">사용자 정보를 불러오는 중...</div>;
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">내 카라반 관리</h1>
        <Link href="/caravans/new" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all">
          + 새 카라반 등록
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <p className="p-6 text-center text-gray-500">카라반 목록을 불러오는 중...</p>
        ) : error ? (
           <p className="p-6 text-center text-red-500">{error}</p>
        ) : caravans.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">아직 등록된 카라반이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">위의 '새 카라반 등록' 버튼을 눌러 시작해보세요!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4">이름</th>
                  <th className="px-6 py-4">위치</th>
                  <th className="px-6 py-4">가격 (1박)</th>
                  <th className="px-6 py-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {caravans.map(caravan => (
                  <tr key={caravan.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{caravan.name}</td>
                    <td className="px-6 py-4">{caravan.location}</td>
                    <td className="px-6 py-4">₩{caravan.pricePerDay.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(caravan.id)}
                        disabled={processingId === caravan.id}
                        className="font-medium text-red-600 hover:text-red-800 hover:underline disabled:text-gray-400 disabled:cursor-wait"
                      >
                        {processingId === caravan.id ? '삭제 중...' : '삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
