// File: frontend/next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 在 build 階段忽略 ESLint 錯誤，避免阻斷 docker build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 把 /api/** 轉發到後端 FastAPI
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8000/:path*',
        // 注意：docker-compose network 裡的服務名稱是 `backend`
      },
    ];
  },
};

export default nextConfig;
