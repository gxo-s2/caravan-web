import { ReservationStatus } from '@prisma/client';
import prisma from '../prisma'; 

/**
 * 예약 생성 + 결제 처리 (트랜잭션)
 */
export const createReservation = async (data: any) => {
  const { caravanId, guestId, startDate, endDate } = data;

  // 1. 카라반 조회
  const caravan = await prisma.caravan.findUnique({ where: { id: caravanId } });
  if (!caravan) throw new Error(`카라반을 찾을 수 없습니다. (ID: ${caravanId})`);

  // 2. 날짜 계산
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  if (diffDays <= 0) throw new Error('체크아웃 날짜 오류: 시작일보다 종료일이 빨라야 합니다.');

  const calculatedPrice = diffDays * caravan.pricePerDay;

  // 3. 트랜잭션 실행
  return await prisma.$transaction(async (tx) => {
    // 예약 생성
    const newReservation = await tx.reservation.create({
      data: {
        startDate: start,
        endDate: end,
        totalPrice: calculatedPrice,
        status: 'CONFIRMED',
        guestId,
        caravanId,
      },
    });

    // 결제 생성
    await tx.payment.create({
      data: {
        amount: calculatedPrice,
        method: 'CARD',
        status: 'COMPLETED',
        reservationId: newReservation.id,
        userId: guestId,
      },
    });

    return newReservation;
  });
};

/**
 * 내 예약 목록 조회
 */
export const getReservationsByUserId = async (userId: string) => {
  return await prisma.reservation.findMany({
    where: { guestId: userId },
    include: { caravan: true, payment: true },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * ✅ [복구됨] 예약 번호(ID)로 단건 조회 (비회원 조회용)
 */
export const getReservationById = async (reservationId: string) => {
  return await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { 
      caravan: true,
      payment: true // 결제 정보도 같이 확인
    },
  });
};

// 기타 함수들
export const getMyReservations = async (userId: string) => getReservationsByUserId(userId);
export const getReservationsForHost = async (hostId: string) => prisma.reservation.findMany({ where: { caravan: { hostId } }, include: { guest: true, caravan: true } });
export const updateReservationStatus = async (id: string, status: string) => prisma.reservation.update({ where: { id }, data: { status: status as ReservationStatus } });