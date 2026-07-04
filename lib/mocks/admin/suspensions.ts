// 회원 정지 이력 Mock (FA022) — 별도 user_suspensions 테이블(OPEN-4 결정)
// UserSuspension 단일 계약. 활성 정지(liftedAt=null) + 과거 해제 이력 혼합.

import type { UserSuspension } from "@/lib/types";

/** 정지 이력 (활성 정지 상단) */
export const MOCK_SUSPENSIONS: UserSuspension[] = [
  {
    id: "sus_01",
    userId: "u_1003",
    reason: "허위 상품 정보 반복 등록 (신고 5건 누적)",
    suspendedBy: "u_1001",
    startsAt: "2026-06-28T10:00:00+09:00",
    endsAt: "2026-07-12T10:00:00+09:00",
    liftedAt: null,
  },
  {
    id: "sus_02",
    userId: "u_1007",
    reason: "거래 분쟁 다수 · 욕설 신고 7건",
    suspendedBy: "u_1001",
    startsAt: "2026-07-02T09:00:00+09:00",
    endsAt: null, // 영구 정지
    liftedAt: null,
  },
  {
    id: "sus_03",
    userId: "u_1002",
    reason: "낙찰 포기 반복 (경고성 단기 정지)",
    suspendedBy: "u_1005",
    startsAt: "2026-05-10T09:00:00+09:00",
    endsAt: "2026-05-13T09:00:00+09:00",
    liftedAt: "2026-05-13T09:00:00+09:00", // 만료 해제
  },
];

/** 현재 활성 정지만 (미들웨어/RLS 차단 대상 시뮬레이션) */
export const ACTIVE_SUSPENSIONS = MOCK_SUSPENSIONS.filter(
  (s) => s.liftedAt === null
);
