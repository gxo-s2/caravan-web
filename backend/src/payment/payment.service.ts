import prisma from '../prisma';
import { updateReservationStatus } from '../reservation/reservation.service';

/**
 * 가상 결제 처리
 * @param amount 결제 금액
 * @param method 결제 수단
 * @param reservationId 예약 ID
 * @param userId 사용자 ID
 */
export const processPayment = async (
  amount: number,
  method: any,
  reservationId: string,
  userId: string,
) => {
  const payment = await prisma.payment.create({
    data: {
      amount,
      method,
      reservationId,
      // userId, // 스키마에 userId 필드 추가 후 주석 해제
    },
  });

  // 결제 완료 시 예약 상태를 CONFIRMED로 변경
  if (payment.status === 'COMPLETED') {
    await updateReservationStatus(reservationId, 'CONFIRMED');
  }

  return payment;
};

/**
 * 특정 유저의 결제 이력 조회
 * @param userId 사용자 ID
 */
export const getPaymentsByUserId = async (userId: string) => {
  return await prisma.payment.findMany({
    where: {
      // userId, // 스키마에 userId 필드 추가 후 주석 해제
    },
    orderBy: {
      paymentDate: 'desc',
    },
    include: {
      reservation: {
        include: {
          caravan: true,
        },
      },
    },
  });
};