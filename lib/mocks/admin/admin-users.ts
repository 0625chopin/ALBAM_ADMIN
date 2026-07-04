// 관리자 계정 Mock (FA001/FA023) — 별도 admin_users 테이블 소속으로 판별
// AdminUser 단일 계약. 부트스트랩(granted_by=null) + 이후 지정 관리자.

import type { AdminUser } from "@/lib/types";

/** 관리자 목록 (부트스트랩 최상단) */
export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    userId: "u_1001", // 0625chopin (부트스트랩)
    role: "admin",
    grantedBy: null,
    grantedAt: "2026-07-04T00:00:00+09:00",
  },
  {
    userId: "u_1005", // 레트로수집가 (지정 관리자)
    role: "admin",
    grantedBy: "u_1001",
    grantedAt: "2026-07-04T09:30:00+09:00",
  },
];
