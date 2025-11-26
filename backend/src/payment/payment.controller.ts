import { Request, Response } from 'express';
import * as paymentService from './payment.service';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { amount, method, reservationId, userId } = req.body;
    const payment = await paymentService.processPayment(
      amount,
      method,
      reservationId,
      userId,
    );
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
  }
};

export const getUserPayments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const payments = await paymentService.getPaymentsByUserId(userId);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve payments' });
  }
};