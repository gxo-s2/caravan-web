/** @type {import('next').NextConfig} */
    const nextConfig = {
      // 💡 404 에러 해결을 위한 프록시(Rewrites) 설정
      // 이 설정은 개발 모드(npm run dev)에서만 작동하며, 
      // 프론트엔드 포트 3000에서 백엔드 포트 3001로 요청을 전달합니다.
      async rewrites() {
        return [
          {
            // '/api/'로 시작하는 모든 요청을 가로챕니다.
            source: '/api/:path*',
            // 백엔드 서버의 3001 포트로 요청을 전달합니다.
            destination: 'http://localhost:3001/api/:path*', 
          },
        ];
      },
    };

    module.exports = nextConfig;