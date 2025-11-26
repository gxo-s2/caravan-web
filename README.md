🚙 CaravanShare: 카라반 공유 플랫폼 MVP

CaravanShare는 카라반(캠핑카) 소유자(호스트)와 이용을 원하는 사용자(게스트)를 연결하는 공유 플랫폼 서비스의 최소 기능 제품(MVP) 구현 프로젝트입니다. 바이브코딩 실전 문제 시나리오를 바탕으로 SOLID 원칙을 적용하여 개발되었습니다.

1. 기능 설명 및 기술 스택 (Features & Tech Stack)

1.1. 🌐 기술 스택 및 환경 요약

본 프로젝트는 Next.js, Node.js, PostgreSQL을 기반으로 하는 3계층 아키텍처로 구성되었습니다.

구분

주요 기술

배포 환경

역할

프론트엔드 (FE)

Next.js (App Router), TypeScript, Tailwind CSS

Vercel

사용자 인터페이스 구현, 상태 관리, API 요청

백엔드 (BE)

Node.js/Express, TypeScript, Prisma ORM

Render

RESTful API 설계, 비즈니스 로직 처리 (예약, 결제)

데이터베이스 (DB)

PostgreSQL

Neon (Serverless DB)

영구 데이터 저장 및 관리

통신 해결

Axios (클라이언트)

N/A

Vercel 환경에서 발생하는 URL 해석 오류 해결을 위해 fetch 대신 사용

1.2. 🔑 구현된 핵심 기능 (Phase 1: MVP)

핵심 기능 영역

상세 구현 내용

1. 사용자 관리

• 회원가입/로그인: 호스트(HOST)/게스트(GUEST) 역할 구분 및 인증/인가.



• 프로필 관리: HOST/GUEST 공통으로 이름, 연락처, 평가, 신원 확인 필드를 조회 및 수정하는 페이지 구현.



• 사용자 신뢰도: 평가(평점) 및 신원 확인 상태 표시.

2. 카라반 정보 관리

• 카라반 등록/삭제: 호스트가 카라반을 등록하고 삭제할 수 있는 기능.



• 정보 제공: 수용 인원, 편의시설, 사진, 위치 등 상세 정보 포함.



• 검색/조회: 게스트가 카라반을 검색/조회하고 상태를 확인할 수 있음.

3. 예약 시스템

• 예약 신청: 게스트의 날짜 기반 예약 신청 및 예약 번호 조회.



• 호스트 관리: 호스트는 예약 목록을 확인하고, 신청된 예약을 승인/거절 처리.



• 날짜 관리: 중복 예약 방지 로직 구현.

4. 결제 및 가격

• 가격 설정/계산: 호스트가 일일 요금을 설정하며, 렌탈 기간 기반으로 총 가격을 계산.



• 결제 시스템: 선결제 시스템 시뮬레이션 및 결제 이력 조회 기능.

5. 리뷰/평가

• 리뷰 작성: 거래 완료 후 게스트가 평점(1-5점) 및 후기를 작성.



• 후기 표시: 카라반 상세 페이지에 해당 후기 목록 표시.

2. 프로젝트 실행 방법 (실습 환경 가이드)

2.1. 🚨 배포 환경 URL

이 프로젝트는 분산 환경에 배포되어 있습니다.

웹사이트 (Vercel FE): 👉 https://caravan-app-chi.vercel.app

API 서버 (Render BE): 👉 https://caravan-app-api.onrender.com

2.2. 개발 환경 (로컬 PC) 실행 가이드

프로젝트의 모든 기능을 확인하려면 로컬 PC(VS Code WSL)에서 백엔드와 프론트엔드 서버 두 개를 동시에 실행해야 합니다.

Repository 클론:

git clone [깃허브 저장소 주소]
cd caravan-app


의존성 설치: backend와 frontend 폴더 각각에서 npm install을 실행합니다.

백엔드 마이그레이션 (DB 연결):

주의: DB 테이블이 이미 생성되었으므로, 로컬 .env 파일이 NeonDB 주소와 동일한지 확인 후 아래 명령을 실행합니다.

cd backend
npx prisma migrate deploy
# 성공 메시지 확인: "No pending migrations to apply."


백엔드 서버 실행 (API 서버):

npm run dev  # 서버는 http://localhost:3001 에서 실행됩니다.


프론트엔드 서버 실행 (웹사이트):

cd ../frontend
npm run dev  # 웹사이트는 http://localhost:3000 에서 실행됩니다.


2.3. 웹사이트 접속 및 테스트

두 서버가 모두 실행된 후, 아래 주소로 접속하여 테스트할 수 있습니다.

개발 환경 접속 주소: 👉 http://localhost:3000

배포된 웹사이트 접속 주소: 👉 https://caravan-app-chi.vercel.app

3. 배포용 웹사이트 제작 과정 (상세 기록)

✅ 배포된 웹사이트 주소: 👉 https://caravan-app-chi.vercel.app

본 섹션은 어떤 배포 서비스를 사용하여 3계층 아키텍처를 구축했는지 요약하고, 그 과정의 주요 내용을 기록합니다.

3.1. 배포 환경 구성

항목

사용 사이트

역할 및 과정 요약

프론트엔드 (FE)

Vercel

Next.js 코드의 자동 빌드 및 배포를 위해 사용. 배포 후 최종 웹사이트 URL(https://caravan-app-chi.vercel.app)을 제공함.

백엔드 (BE)

Render

Node.js/Express API 서버를 호스팅하기 위해 사용. DATABASE_URL 등 환경 변수를 설정하고, 지속적인 서비스 엔드포인트(https://caravan-app-api.onrender.com)를 제공함.

데이터베이스 (DB)

Neon

PostgreSQL 데이터베이스를 Serverless 형태로 제공받음. Render BE의 DATABASE_URL에 연결 정보를 제공하여 영구 데이터 저장소로 활용함.

3.2. 주요 기술적 난제 해결 과정

DB 마이그레이션 이슈: GitHub Actions와 NeonDB 간의 환경 변수 및 마이그레이션 충돌 문제를 해결하기 위해, 모든 마이그레이션 기록에 대한 강제 기준선 설정(prisma migrate resolve) 및 DATABASE_URL 값의 최종 정제 과정을 거침.

FE-BE 통신 장애: Vercel 환경에서 fetch 사용 시 발생하는 잘못된 URL 해석(127.0.0.1로 요청) 문제를 해결하기 위해, 통신 라이브러리를 Axios로 교체하고 하드코딩된 로컬 주소 잔재를 모두 제거하여 배포된 Render 주소로만 통신하도록 보장함.
