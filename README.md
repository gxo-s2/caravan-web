# 🚙 CaravanShare: 카라반 공유 플랫폼 MVP

**CaravanShare**는 카라반(캠핑카) 소유자(호스트)와 이용을 원하는 사용자(게스트)를 연결하는 공유 플랫폼 서비스의 최소 기능 제품(MVP) 구현 프로젝트입니다. **바이브코딩 실전 문제** 시나리오를 바탕으로 **SOLID 원칙**을 적용하여 개발되었습니다.

-----

## 1️⃣ 기능 설명 및 기술 스택 (Features & Tech Stack)

### 🌐 기술 스택 및 환경 요약

이 프로젝트는 Decoupled Architecture(프론트엔드와 백엔드 분리)를 채택했으며, 현대적인 JavaScript 생태계 기술을 사용하여 구축되었습니다.

| 구분 | 주요 기술 | 배포 환경 | 역할 |
| :--- | :--- | :--- | :--- |
| **프론트엔드 (FE)** | **Next.js** (App Router), **TypeScript**, **Tailwind CSS** | Vercel | 사용자 인터페이스 구현, 상태 관리, API 요청 처리 |
| **백엔드 (BE)** | **Node.js/Express**, **TypeScript**, **Prisma ORM** | Render | RESTful API 설계, 비즈니스 로직 처리 (예약, 결제), 데이터베이스 연동 |
| **데이터베이스 (DB)** | **PostgreSQL** | Neon | 영구 데이터 저장 및 관리 |
| **통신 해결** | **Axios** (클라이언트) | N/A | Vercel 환경에서 발생하는 URL 해석 오류 해결을 위해 fetch 대신 사용 |

### 🔑 구현된 핵심 기능 (Phase 1: MVP)

| 핵심 기능 영역 | 상세 구현 내용 |
| :--- | :--- |
| **1. 사용자 관리** | • **회원가입/로그인:** 호스트(HOST)/게스트(GUEST) 역할 구분 및 인증/인가 (로컬 저장소 기반 임시 인증).<br>• **프로필 관리:** HOST/GUEST 공통으로 이름, 연락처, 평가, 신원 확인 필드를 조회 및 수정하는 페이지 구현.<br>• **사용자 신뢰도:** 평가(평점) 및 신원 확인 상태 표시. |
| **2. 카라반 정보 관리** | • **카라반 등록/수정/삭제:** 호스트가 카라반을 등록하고 삭제할 수 있는 기능.<br>• **정보 제공:** 수용 인원, 편의시설, 사진, 위치 등 상세 정보 포함.<br>• **검색/조회:** 게스트가 카라반을 검색/조회하고 상태(사용가능/예약됨/정비중)를 확인할 수 있음. |
| **3. 예약 시스템** | • **예약 신청:** 게스트의 날짜 기반 예약 신청 및 예약 번호 조회.<br>• **호스트 관리:** 호스트는 **예약 목록**을 확인하고, 신청된 예약을 **승인/거절** 처리.<br>• **날짜 관리:** **중복 예약 방지 로직** 구현. |
| **4. 결제 및 가격** | • **가격 설정/계산:** 호스트가 일일 요금을 설정하며, 렌탈 기간 기반으로 총 가격을 계산.<br>• **결제 시스템:** 선결제 시스템 시뮬레이션 및 결제 이력 조회 기능. |
| **5. 리뷰/평가** | • **리뷰 작성:** 거래 완료 후 게스트가 평점(1-5점) 및 후기를 작성.<br>• **후기 표시:** 카라반 상세 페이지에 해당 후기 목록 표시. |

-----

## 2️⃣ 프로젝트 실행 방법 (로컬 환경 가이드)

프로젝트의 모든 기능을 테스트하려면 로컬 PC(예: VS Code WSL)에서 \*\*백엔드 서버(API)\*\*와 **프론트엔드 서버(웹사이트)** 두 개를 동시에 실행해야 합니다.

### 2.1. 개발 환경 준비

1.  **Repository 클론:** 이 프로젝트를 로컬 환경으로 복사합니다.
    ```bash
    git clone [깃허브 저장소 주소]
    cd caravan-app
    ```
2.  **의존성 설치:** `backend`와 `frontend` 폴더 각각에서 의존성을 설치합니다.
    ```bash
    # 백엔드 폴더에서
    cd backend
    npm install

    # 프론트엔드 폴더로 이동
    cd ../frontend
    npm install
    ```

### 2.2. 서버 실행 및 접속

| 서버 종류 | 명령어 | 접속 주소 |
| :--- | :--- | :--- |
| **백엔드 (API)** | `cd backend` 후 `npm run dev` | **`http://localhost:3001`** |
| **프론트엔드 (웹)** | `cd ../frontend` 후 `npm run dev` | **`http://localhost:3000`** |

> **Tip:** 두 서버(`http://localhost:3001` 및 `http://localhost:3000`)가 모두 실행된 후, 웹 브라우저에서 **`http://localhost:3000`** 으로 접속하여 모든 기능을 테스트할 수 있습니다.

-----

## 3️⃣ 배포 환경 및 제작 (Deployment)

본 프로젝트는 클라우드 서비스를 활용하여 프론트엔드와 백엔드를 분리(Split Deployment)하여 배포했습니다.

### ✅ 배포된 웹사이트 주소

👉 **[https://caravan-app-chi.vercel.app](https://caravan-app-chi.vercel.app)**

### 🧪 테스트용 계정 정보

배포된 사이트에서 기능을 테스트하기 위해 아래 계정을 사용하실 수 있습니다.

| 계정 유형 | 아이디 (Email) | 비밀번호 (Password) |
| :--- | :--- | :--- |
| **호스트 (Host)** | `testhost@example.com` | `testhost` |
| **게스트 (Guest)** | `testguest@example.com` | `testguest` |

### 3.1. 배포 환경 구성

| 컴포넌트 | 배포 플랫폼 | 상세 설명 |
| :--- | :--- | :--- |
| **프론트엔드** (FE) | **Vercel** | Next.js 프로젝트의 특성을 활용하여 Vercel에 배포. 빠른 빌드와 CDN을 통한 정적/동적 콘텐츠 제공. |
| **백엔드** (BE) | **Render** | Node.js/Express 기반의 API 서버를 Render에 배포. 데이터베이스 연결 및 비즈니스 로직 처리 담당. |
| **데이터베이스** (DB) | **Neon (PostgreSQL)** | 서버리스 PostgreSQL 서비스인 Neon을 사용하여 데이터베이스를 관리. 안정적인 연결과 확장성을 확보. |

### 3.2. 배포된 웹사이트 URL

  * **웹사이트 (Vercel FE):** 👉 **`https://caravan-app-chi.vercel.app`**
  * **API 서버 (Render BE):** 👉 **`https://caravan-app-api.onrender.com`**

### 3.3. 배포 및 연동 과정 (Deployment Process)

본 서비스는 **Database → Backend → Frontend** 순서로 유기적으로 연결하여 배포를 진행했습니다.

#### **Step 1: 데이터베이스 구축 (Neon)**

1.  **Serverless Postgres 생성:** Neon 플랫폼에서 새로운 프로젝트를 생성하여 클라우드 기반의 PostgreSQL 인스턴스를 확보했습니다.
2.  **Prisma 연동:** 발급받은 `DATABASE_URL`을 백엔드 환경 변수에 등록하고, `prisma schema`를 통해 테이블 구조를 정의했습니다.
3.  **마이그레이션:** 로컬 개발 환경에서 `npx prisma db push`를 통해 정의된 스키마를 실제 클라우드 DB에 동기화했습니다.

#### **Step 2: 백엔드 서버 배포 (Render)**

1.  **GitHub Repository 연동:** Render 웹 서비스에 GitHub 리포지토리(`backend` 디렉토리)를 연동했습니다.
2.  **환경 변수 설정:** 보안이 필요한 `DATABASE_URL`, `JWT_SECRET` 등의 환경 변수를 Render Dashboard에 등록했습니다.
3.  **빌드 및 시작 커맨드 설정:**
      * Build Command: `npm install && npx prisma generate` (의존성 설치 및 Prisma 클라이언트 생성)
      * Start Command: `node dist/index.js` (또는 `npm start`)

#### **Step 3: 프론트엔드 배포 (Vercel)**

1.  **Next.js 최적화 배포:** Vercel에 GitHub 리포지토리(`frontend` 디렉토리)를 연동하여 Next.js 프레임워크에 최적화된 빌드 파이프라인을 구축했습니다.
2.  **API 연동:** 백엔드 API와의 통신을 위해 `NEXT_PUBLIC_API_URL` 환경 변수에 Render에서 배포된 백엔드 주소를 등록했습니다.
3.  **CI/CD 자동화:** GitHub의 `master` 브랜치에 코드가 푸시될 때마다 자동으로 빌드 및 배포가 수행되도록 파이프라인을 구성했습니다.
