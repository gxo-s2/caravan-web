import { PrismaClient } from '@prisma/client';

// PrismaClient 인스턴스를 전역 변수에 저장하여, 개발 중 
// 핫 리로딩(파일 저장 시 재시작) 때마다 DB 연결이 계속 늘어나는 것을 방지합니다.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 기존에 만들어둔 인스턴스가 있으면 재사용하고, 없으면 새로 생성합니다.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Vercel 환경에서 DB 연결 안정성을 높이고 오류 추적을 위해 로그 레벨 설정
    log: ['query', 'info', 'warn', 'error'], 
    
    // Vercel 환경에서 DB 연결 안정성을 높이기 위한 명시적 설정
    // 환경 변수가 정상적으로 전달되도록 보장합니다.
    datasources: {
      db: {
        url: process.env.DATABASE_URL, // Vercel에 등록된 DB 주소를 사용합니다.
      },
    },
    
    // rejectOnNotFound 옵션은 현재 버전에서 타입 오류를 일으키므로 제거합니다.
  });

// 프로덕션(배포) 환경이 아닐 때만 전역 변수에 할당합니다.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;