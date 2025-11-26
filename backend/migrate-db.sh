#!/bin/bash
# 데이터베이스 URL 환경 변수가 설정되었는지 확인
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL 환경 변수가 설정되지 않았습니다."
  exit 1
fi

# 의존성 설치 (필요한 경우)
npm install

# Prisma 마이그레이션 실행
echo "Prisma 마이그레이션 적용 중..."
npx prisma migrate deploy --preview-feature

echo "마이그레이션 완료."