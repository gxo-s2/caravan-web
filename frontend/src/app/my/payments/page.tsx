'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

// 타입 정의
interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  paymentDate: string;
  reservation: {
    id: string;
    caravan: {
      name: string;
    };
  };
}

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }
      const user = JSON.parse(storedUser);

      try {
        const response = await axios.get(`http://localhost:3001/api/payments/user/${user.id}`);
        setPayments(response.data);
      } catch (err) {
        setError('결제 내역을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div className="text-center py-20">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">나의 결제 내역</h1>

      {payments.length === 0 ? (
        <div className="text-center bg-gray-100 rounded-lg p-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">결제 내역이 없습니다.</h2>
          <p className="text-gray-500 mb-6">아직 CaravanShare를 통해 결제한 내역이 없으시군요!</p>
          <Link href="/caravans" className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors">
            멋진 카라반 찾아보기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-indigo-700">{payment.reservation?.caravan?.name || '알 수 없는 카라반'}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    예약 번호: {payment.reservation.id}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="text-lg font-bold">₩{payment.amount.toLocaleString()}</p>
                  <p className={`text-sm font-semibold ${
                    payment.status === 'COMPLETED' ? 'text-green-600' :
                    payment.status === 'REFUNDED' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {payment.status}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
                <span>결제일: {new Date(payment.paymentDate).toLocaleDateString()}</span>
                <span>결제수단: {payment.method}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}