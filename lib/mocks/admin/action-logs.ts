// 관리자 조치 감사 로그 Mock (FA002) — 모든 조치의 책임성 추적(누가·언제·무엇을·왜)
// AdminActionLog 단일 계약. 전역 최신 조치 피드. 실 전환 시 admin_action_logs 조회로 교체.

import type { AdminActionLog } from "@/lib/types";

/** 조치 로그 (최신순) */
export const MOCK_ACTION_LOGS: AdminActionLog[] = [
  {
    id: "log_10",
    adminId: "u_1001",
    actionType: "blind_content",
    targetType: "rating",
    targetId: "rt_7003",
    reason: "허위 별점 테러 신고 확인 (r_5004)",
    meta: { reportId: "r_5004" },
    createdAt: "2026-07-03T11:40:00+09:00",
  },
  {
    id: "log_02",
    adminId: "u_1001",
    actionType: "suspend_user",
    targetType: "user",
    targetId: "u_1007",
    reason: "거래 분쟁 다수 · 욕설 신고 7건",
    meta: { endsAt: null },
    createdAt: "2026-07-02T09:00:00+09:00",
  },
  {
    id: "log_03",
    adminId: "u_1005",
    actionType: "grant_penalty",
    targetType: "user",
    targetId: "u_1007",
    reason: "낙찰 포기 반복",
    meta: { penaltyType: "abandon_won" },
    createdAt: "2026-07-01T19:05:00+09:00",
  },
  {
    id: "log_01",
    adminId: "u_1001",
    actionType: "suspend_user",
    targetType: "user",
    targetId: "u_1003",
    reason: "허위 상품 정보 반복 등록 (신고 5건 누적)",
    meta: { endsAt: "2026-07-12T10:00:00+09:00" },
    createdAt: "2026-06-28T10:00:00+09:00",
  },
  {
    id: "log_00",
    adminId: "u_1005",
    actionType: "force_cancel_transaction",
    targetType: "transaction",
    targetId: "t_3009",
    reason: "판매자 잠적으로 거래 강제 취소",
    meta: { from: "pending", to: "canceled" },
    createdAt: "2026-06-25T14:10:00+09:00",
  },
];
