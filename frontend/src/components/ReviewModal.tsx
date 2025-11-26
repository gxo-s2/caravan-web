'use client';

import { useState } from 'react';
import axios from 'axios';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caravanId: string;
  caravanName: string;
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onClose, caravanId, caravanName, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return alert('로그인이 필요합니다.');
    const user = JSON.parse(userStr);

    if (!comment.trim()) {
      return alert('후기 내용을 입력해주세요.');
    }

    setLoading(true);
    try {
      // 백엔드 API 호출 (포트 3001)
      await axios.post('http://127.0.0.1:3001/api/reviews', {
        authorId: user.id,
        caravanId,
        rating,
        comment,
      });
      
      alert('소중한 리뷰가 등록되었습니다!');
      onSuccess(); // 목록 새로고침
      onClose();   // 모달 닫기
    } catch (error: any) {
      console.error('리뷰 등록 실패:', error);
      const errMsg = error.response?.data?.message || '리뷰 등록 중 오류가 발생했습니다.';
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // 별 아이콘 (SVG)
  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8"
    >
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.326 1.163l-4.304 3.86a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.304-3.86a.562.562 0 01.326-1.163l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4 animate-fade-in-up">
        
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">리뷰 작성</h3>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-indigo-600 text-base block mb-1">{caravanName}</span>
            여행은 어떠셨나요? 솔직한 후기를 들려주세요.
          </p>
        </div>

        {/* 별점 선택 */}
        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              type="button"
              className={`transition-transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
            >
              <StarIcon filled={star <= rating} />
            </button>
          ))}
        </div>

        {/* 후기 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">상세 후기</label>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-32 text-sm bg-gray-50"
            placeholder="좋았던 점, 아쉬웠던 점을 자유롭게 적어주세요..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            취소
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-md transition-colors disabled:bg-indigo-400"
          >
            {loading ? '등록 중...' : '리뷰 등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
}