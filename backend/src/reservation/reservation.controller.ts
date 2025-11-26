import { Request, Response } from 'express';
import * as reservationService from './reservation.service';

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { caravanId, guestId, startDate, endDate } = req.body;
    
    console.log(`📝 예약 요청 수신: Caravan(${caravanId}), Guest(${guestId})`);

    // 유효성 검사
    if (!caravanId || !guestId || !startDate || !endDate) {
      return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    const newReservation = await reservationService.createReservation({
        caravanId,
        guestId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
    });

    res.status(201).json(newReservation);
  } catch (error: any) {
    // 🚨 여기가 핵심입니다! 에러의 진짜 내용을 클라이언트에 전달합니다.
    console.error('🔥 백엔드 예약 생성 실패:', error);
    
    // Prisma 에러 메시지를 포함하여 응답
    res.status(500).json({ 
      message: `🔥 [상세 에러 로그]: ${error.message || '알 수 없는 서버 오류'}` 
    });
  }
};

export const getUserReservations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    if (!userId) return res.status(400).json({ message: 'User ID is required.' });
    const reservations = await reservationService.getReservationsByUserId(userId);
    res.status(200).json(reservations || []);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getHostReservations = async (req: Request, res: Response) => {
  try {
    const { hostId } = req.params;
    const reservations = await reservationService.getReservationsForHost(hostId);
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { status } = req.body;
    const updatedReservation = await reservationService.updateReservationStatus(id, status);
    res.status(200).json(updatedReservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ [추가] 예약 조회 (비회원용)
export const lookupReservation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const reservation = await reservationService.getReservationById(id);
    if (!reservation) {
      return res.status(404).json({ message: '예약 정보를 찾을 수 없습니다.' });
    }
    res.status(200).json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};