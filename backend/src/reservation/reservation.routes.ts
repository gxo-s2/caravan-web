import { Router } from 'express';
import { 
  createReservation, 
  getUserReservations, 
  getHostReservations, 
  updateReservationStatus,
  lookupReservation // ✅ 컨트롤러에서 만든 조회 함수 import
} from './reservation.controller';

const router = Router();

// ==========================================
// Guest Routes (게스트용)
// ==========================================

// 예약 생성
router.post('/', createReservation);

// ✅ [중요] 비회원 예약 조회 (로그인 없이 접근 가능)
// 이 라우트가 '/user/:userId' 보다 위에 있어야 안전하게 매칭될 수 있습니다.
router.get('/lookup/:id', lookupReservation);

// 내 예약 조회 (로그인 유저용)
router.get('/user/:userId', getUserReservations);


// ==========================================
// Host Routes (호스트용)
// ==========================================

// 호스트의 카라반에 들어온 예약 조회
router.get('/host/:hostId', getHostReservations);

// 예약 상태 변경 (승인/거절/취소)
router.patch('/:id/status', updateReservationStatus);

export default router;