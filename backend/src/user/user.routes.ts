import { Router } from 'express';
// ✅ [수정] 컨트롤러에서 export된 함수명과 정확히 일치하도록 import 합니다.
import { signUp, logIn, getUser, updateUser } from './user.controller';

const router = Router();

// Authentication
router.post('/signup', signUp);
router.post('/login', logIn);

// User Profile
router.get('/:id', getUser);
router.patch('/:id', updateUser);

export default router;