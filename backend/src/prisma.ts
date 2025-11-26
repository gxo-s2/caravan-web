import { PrismaClient } from '@prisma/client';

// PrismaClient 인스턴스를 전역 변수에 저장하여, 개발 중 
// 핫 리로딩(파일 저장 시 재시작) 때마다 DB 연결이 계속 늘어나는 것을 방지합니다.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 기존에 만들어둔 인스턴스가 있으면 재사용하고, 없으면 새로 생성합니다.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // 디버깅을 위해 쿼리 로그 출력
  });

// 프로덕션(배포) 환경이 아닐 때만 전역 변수에 할당합니다.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;