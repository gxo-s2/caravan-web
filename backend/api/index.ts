// caravan-app/backend/api/index.ts (수정된 전체 코드)

// ⭐ '../src/index'로 경로를 수정했습니다.
// 'backend/src/index.ts' 파일을 임포트합니다.
import app from '../src/index';

// Vercel 서버리스 함수로 Express 앱을 내보냅니다.
export default app;