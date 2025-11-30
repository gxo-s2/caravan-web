import { Router } from 'express';
import { 
  createCaravan, 
  getAllCaravans, 
  getCaravanById,
  getCaravansByHost,
  deleteCaravan,
  updateCaravan,      // 'updateCaravan' 컨트롤러 함수 임포트
} from './caravan.controller';

const router = Router();

// POST /api/caravans - 카라반 등록
router.post('/', createCaravan); 

// GET /api/caravans - 전체 목록 조회
router.get('/', getAllCaravans);

// GET /api/caravans/host/:hostId - 특정 호스트의 카라반 목록 조회
router.get('/host/:hostId', getCaravansByHost);

// PUT /api/caravans/:id - 특정 카라반 정보 수정
router.put('/:id', updateCaravan);

// DELETE /api/caravans/:id - 특정 카라반 삭제
router.delete('/:id', deleteCaravan);

// GET /api/caravans/:id - 단일 카라반 상세 조회 (가장 마지막에 위치)
router.get('/:id', getCaravanById);

export default router;