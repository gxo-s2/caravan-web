import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// 라우터 import
import userRoutes from './user/user.routes';
import caravanRoutes from './caravan/caravan.routes';
import reservationRoutes from './reservation/reservation.routes';
import paymentRoutes from './payment/payment.routes';
import reviewRoutes from './review/review.routes';

console.log("Starting CaravanShare Backend Server...");

const app = express();
// 서버리스 환경에서는 port 변수가 사용되지 않으므로 제거합니다.
// const port = Number(process.env.PORT) || 3001; // ❌ 제거

// CORS 설정: 모든 출처 허용 (개발 편의성 및 연결 오류 방지)
app.use(cors({
  origin: true, 
  credentials: true,
}));

app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  // Vercel 환경에서도 작동하는 기본 상태 확인 응답
  res.send('Hello, CaravanShare backend serverless function is running!');
});

// API 라우터 연결
app.use('/api/users', userRoutes);
app.use('/api/caravans', caravanRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);


// --------------------------------------------------------------------
// ⭐ Vercel 서버리스 환경을 위한 핵심 변경 사항
// --------------------------------------------------------------------

// 1. 서버 실행 및 리스닝 관련 코드를 모두 제거합니다. 
// const server = app.listen(port, '0.0.0.0', () => { ... }); // ❌ 제거

// 2. Heartbeat 및 프로세스 종료 관련 코드를 모두 제거합니다.
// setInterval(() => { ... }); // ❌ 제거
// process.on('exit', (code) => { ... }); // ❌ 제거
// const gracefulShutdown = () => { ... }; // ❌ 제거
// process.on('SIGTERM', gracefulShutdown); // ❌ 제거
// process.on('SIGINT', gracefulShutdown); // ❌ 제거

// 3. Express 앱 객체를 기본 내보내기(default export) 합니다.
export default app;