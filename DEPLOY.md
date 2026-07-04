# albam-admin 배포 가이드 (Vercel)

관리자 콘솔의 **독립 Vercel 배포**. 공개 앱과 별도 프로젝트·도메인·env. (근거: `docs/division.md` §4)

> ⚠️ 대부분 계정 소유자(0625chopin) 1회 작업. 코드/설정은 준비 완료.

## 선행

1. **`@0625chopin/shared` 발행** (shared 레포 `PUBLISHING.md`) — Vercel 빌드는 file 링크가 아니라
   발행 버전을 설치한다.
2. `package.json`의 `"@0625chopin/shared": "file:../almbam-shared"` → 발행 버전(`^0.1.0`)으로 교체.
   (로컬은 file 링크 유지 가능하나, 커밋/배포본은 발행 버전 사용)

## Vercel 프로젝트 생성

1. Vercel → New Project → `albam-admin` 레포 연결.
2. Framework: Next.js(자동). Root Directory: 레포 루트. Build: `next build`(기본).
3. **환경변수** (Settings → Environment Variables):
   | key | 비고 |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | 공개 앱과 동일 Supabase |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 공개 |
   | `SUPABASE_SERVICE_ROLE_KEY` | **서버 전용** — admin 강제/제재 admin RPC용(TS18 격리) |
   | `NPM_TOKEN` | `read:packages` — @0625chopin/shared 설치(Build) |
4. **도메인** 연결: `admin.<도메인>`(서브도메인) 또는 완전 별도 도메인(TS03). admin은 자체 로그인이라
   쿠키 공유 불필요.

## 배포 후 확인

- 프로덕션 빌드 그린(@0625chopin/shared 인증 설치 → transpile → build).
- `/login` 접근 가능, 미인증으로 `/`·기타 경로 접근 시 `/login` 리다이렉트(proxy.ts, TS17).
- 로그인(관리자 계정) 후 콘솔 진입. (admin_users 게이팅은 TA057 이후 실동작)

## (선택) 접근 이중화

- Vercel **Deployment Protection**(Password/Trusted IPs) 또는 미들웨어 가드로 admin 도메인 보호 강화.
