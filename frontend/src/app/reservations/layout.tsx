// frontend/src/app/reservations/layout.tsx

import { Suspense } from 'react';

// children은 이 폴더의 하위 페이지들(lookup/, success/, page.tsx 등)을 나타냅니다.
export default function ReservationsLayout({ children }) {
  return (
    // <Suspense>로 감싸서 useSearchParams() 사용으로 인한 서버 측 렌더링 오류를 방지합니다.
    <Suspense>
      {children}
    </Suspense>
  );
}