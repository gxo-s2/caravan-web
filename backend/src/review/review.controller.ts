import { Request, Response } from 'express';
// ✅ [수정] 클래스가 아닌 함수들을 직접 import 합니다.
import * as reviewService from './review.service';

// ❌ [삭제] 클래스 인스턴스 생성 코드 제거
// const reviewService = new ReviewService();

export const createReview = async (req: Request, res: Response) => {
  try {
    const { authorId, caravanId, rating, comment } = req.body;

    // 유효성 검사
    if (!authorId || !caravanId || rating === undefined || !comment) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }

    // ✅ [수정] 함수 직접 호출
    const newReview = await reviewService.createReview({
      authorId, 
      caravanId, 
      rating, 
      comment
    });
    
    res.status(201).json(newReview);
  } catch (error: any) {
    console.error('리뷰 생성 실패:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsByCaravanId = async (req: Request, res: Response) => {
  try {
    const { caravanId } = req.params;

    if (!caravanId) {
      return res.status(400).json({ message: 'Caravan ID is required.' });
    }

    // ✅ [수정] 함수 직접 호출
    const reviews = await reviewService.getReviewsByCaravanId(caravanId);
    res.status(200).json(reviews);
  } catch (error: any) {
    console.error('리뷰 조회 실패:', error);
    res.status(500).json({ message: error.message });
  }
};

// 라우터에서 사용하는 함수명과 일치시키기 위해 추가 (선택 사항)
export const getCaravanReviews = getReviewsByCaravanId;