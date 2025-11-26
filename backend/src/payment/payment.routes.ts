import { Router } from 'express';
import * as paymentController from './payment.controller';

const router = Router();

router.post('/', paymentController.createPayment);
router.get('/user/:userId', paymentController.getUserPayments);

export default router;