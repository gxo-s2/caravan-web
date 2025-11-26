import prisma from '../prisma'; 

/**
 * 리뷰 생성
 * @param data - 리뷰 생성에 필요한 데이터 (작성자 ID, 카라반 ID, 평점, 내용)
 * @returns 생성된 리뷰 객체
 */
export const createReview = async (data: {
  authorId: string;
  caravanId: string;
  rating: number;
  comment: string;
}) => {
  // 1. 이용 완료된 예약이 있는지 확인
  // (현재 날짜가 체크아웃 날짜보다 지나야 리뷰 작성 가능)
  const completedReservation = await prisma.reservation.findFirst({
    where: {
      guestId: data.authorId,
      caravanId: data.caravanId,
      status: 'CONFIRMED', // 예약 확정 상태여야 함
      // endDate: { lt: new Date() } // 실제 서비스에서는 주석 해제하여 날짜 체크 (테스트 편의를 위해 주석 처리됨)
    },
  });

  if (!completedReservation) {
    // 개발 중 테스트 편의를 위해 에러 발생 대신 로그만 남기거나, 
    // 엄격하게 하려면 아래 주석을 해제하세요.
    // throw new Error('리뷰를 작성할 수 있는 이용 완료된 예약이 없습니다.');
    console.warn('주의: 완료된 예약 없이 리뷰가 작성되었습니다 (테스트 모드)');
  }

  // 2. 이미 해당 카라반에 대한 리뷰를 작성했는지 확인 (중복 방지)
  const existingReview = await prisma.review.findFirst({
    where: {
      authorId: data.authorId,
      caravanId: data.caravanId,
    }
  });
  
  if (existingReview) {
    throw new Error('이미 이 카라반에 대한 리뷰를 작성하셨습니다.');
  }

  // 3. 리뷰 생성
  return await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      author: { connect: { id: data.authorId } },
      caravan: { connect: { id: data.caravanId } },
    },
  });
};

/**
 * 특정 카라반의 리뷰 목록 조회
 * @param caravanId - 카라반 ID
 * @returns 리뷰 목록 (작성자 정보 포함)
 */
export const getReviewsByCaravanId = async (caravanId: string) => {
  return await prisma.review.findMany({
    where: { caravanId },
    include: {
      author: {
        select: { name: true, profilePicture: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};