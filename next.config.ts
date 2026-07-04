import type { NextConfig } from "next";

// Supabase Storage 공개 URL 호스트 (next/image 허용)
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  cacheComponents: true,
  // 공유 패키지(@0625chopin/shared)의 TS/JSX·"use client" 지시문을 Next가 컴파일하도록.
  transpilePackages: ["@0625chopin/shared"],
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
