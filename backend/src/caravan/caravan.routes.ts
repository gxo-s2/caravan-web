import { Router } from 'express';
import { 
  createCaravan, 
  getAllCaravans, 
  getCaravanById,
  getCaravansByHost, // 1. 호스트별 조회 컨트롤러 임포트
  deleteCaravan,      // 2. 삭제 컨트롤러 임포트
} from './caravan.controller';

const router = Router();

// POST /api/caravans - 카라반 등록
router.post('/', createCaravan); 

// GET /api/caravans - 전체 목록 조회
router.get('/', getAllCaravans);

// GET /api/caravans/host/:hostId - 특정 호스트의 카라반 목록 조회
router.get('/host/:hostId', getCaravansByHost);

// DELETE /api/caravans/:id - 특정 카라반 삭제
router.delete('/:id', deleteCaravan);

// GET /api/caravans/:id - 단일 카라반 상세 조회 (가장 마지막에 위치)
router.get('/:id', getCaravanById);

export default router;