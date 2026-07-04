// 채팅·평점 모니터링 Mock (FA070/FA080) `3차(선택)`
// AdminMessageView(Message+isBlinded) / AdminRatingView(Rating+isBlinded) 단일 계약.
// OPEN-6: 채팅 열람은 개인정보 정책상 신고 방/메시지로 범위 제한 + 마스킹 + 열람 감사 권장.

import type { AdminMessageView, AdminRatingView } from "@/lib/types";

/** 신고된 채팅방의 메시지 (모니터링 대상만) */
export const MOCK_ADMIN_MESSAGES: AdminMessageView[] = [
  {
    id: "m_9012",
    roomId: "room_401",
    senderId: "u_1007",
    content: "그 가격엔 안 팔아요. 장난하냐?",
    createdAt: "2026-07-04T14:30:00+09:00",
    isBlinded: false,
  },
  {
    id: "m_9013",
    roomId: "room_401",
    senderId: "u_1002",
    content: "정가 문의드린 건데 욕은 하지 마세요.",
    createdAt: "2026-07-04T14:32:00+09:00",
    isBlinded: false,
  },
  {
    id: "m_9014",
    roomId: "room_401",
    senderId: "u_1007",
    content: "내 번호 010-1234-5678로 직접 연락해",
    createdAt: "2026-07-04T14:35:00+09:00",
    isBlinded: true,
  },
];

/** 신고/악성 의심 평점 */
export const MOCK_ADMIN_RATINGS: AdminRatingView[] = [
  {
    id: "rt_7003",
    transactionId: "t_3009",
    raterId: "u_1002",
    rateeId: "u_1007",
    role: "as_buyer",
    score: 1,
    comment: "사기꾼입니다 절대 거래하지 마세요",
    isBlinded: true,
  },
  {
    id: "rt_7004",
    transactionId: "t_3003",
    raterId: "u_1004",
    rateeId: "u_1005",
    role: "as_buyer",
    score: 10,
    comment: "빠른 배송 감사합니다!",
    isBlinded: false,
  },
  {
    id: "rt_7005",
    transactionId: "t_3001",
    raterId: "u_1008",
    rateeId: "u_1001",
    role: "as_seller",
    score: 2,
    comment: "연락 두절, 별점 테러 유발",
    isBlinded: false,
  },
];

/**
 * 개인정보 마스킹 (OPEN-6) — 전화번호/이메일 등 노출 방지.
 * 실 열람은 신고 방/메시지 범위 제한 + 열람 감사 후 원문 노출(A5).
 */
export function maskPii(text: string): string {
  return text
    .replace(/01[016789][-\s]?\d{3,4}[-\s]?\d{4}/g, "010-****-****")
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "***@***");
}
