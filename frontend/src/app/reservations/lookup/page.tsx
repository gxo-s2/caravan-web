"use client";

import { useState } from 'react';
import axios from 'axios';
import { Reservation } from '@/types/reservation';
import { Caravan } from '@/types/caravan';

// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split('T')[0];
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
};

// Badge component for reservation status
const StatusBadge = ({ status }: { status: Reservation['status'] }) => {
  const statusStyles: { [key in Reservation['status']]: string } = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};


const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <img 
          src={reservation.caravan.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={reservation.caravan.name} 
          className="w-full h-56 object-cover" 
        />
        <div className="absolute top-4 right-4">
          <StatusBadge status={reservation.status} />
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-1">{reservation.caravan.location}</p>
        <h3 className="text-2xl font-bold mb-3 truncate">{reservation.caravan.name}</h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">예약 날짜:</span> {formatDate(reservation.startDate)} ~ {formatDate(reservation.endDate)}
          </p>
          <p>
            <span className="font-semibold">총 결제 금액:</span> {formatCurrency(reservation.totalPrice)}
          </p>
        </div>
      </div>
    </div>
  );

const ReservationLookupPage = () => {
  const [reservationId, setReservationId] = useState('');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!reservationId.trim()) {
      setError('예약 번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    setReservation(null);
    try {
      const response = await axios.get(`http://localhost:3001/api/reservations/lookup/${reservationId}`);
      setReservation(response.data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('해당 예약 번호를 찾을 수 없습니다.');
      } else {
        setError('조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">예약 조회</h1>
        <p className="text-gray-600 mb-8">예약 번호를 입력하여 예약 내역을 확인하세요.</p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
            placeholder="예약 번호(UUID)를 입력하세요"
            className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? '조회 중...' : '조회'}
          </button>
        </div>
      </div>

      <div className="mt-12 max-w-2xl mx-auto">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {reservation && <ReservationCard reservation={reservation} />}
      </div>
    </div>
  );
};

export default ReservationLookupPage;
