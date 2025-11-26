import { Router } from 'express';
// ✅ [수정] 컨트롤러에 정의된 함수명과 일치하도록 import 합니다.
import { createReview, getReviewsByCaravanId } from './review.controller';

const router = Router();

// Note: In a real app, the POST route would be protected
// and the authorId would be extracted from the authentication token.

// 리뷰 생성
router.post('/', createReview);

// 특정 카라반의 리뷰 조회
router.get('/caravan/:caravanId', getReviewsByCaravanId);

export default router;