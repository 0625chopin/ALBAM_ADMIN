// 회원 관리 Mock 데이터 (FA020/FA021)
// AdminMemberRow(목록) + AdminMemberDetail(상세) 단일 계약. 실 Supabase 전환 시 조회부만 교체.

import type {
  AdminMemberRow,
  AdminMemberDetail,
  UserSuspension,
  AdminActionLog,
} from "@/lib/types";
import type { Penalty } from "@0625chopin/shared/types";

/** 회원 목록 (신고 많은/정지 회원이 상단에 오도록 섞어 배치) */
export const MOCK_MEMBERS: AdminMemberRow[] = [
  {
    id: "u_1001",
    nickname: "쇼팽마켓",
    region: "서울 강남구",
    sellerLevel: 4,
    buyerLevel: 3,
    isSuspended: false,
    recentPenaltyCount: 0,
    reportedCount: 0,
    joinedAt: "2026-03-11T09:20:00+09:00",
  },
  {
    id: "u_1002",
    nickname: "중고왕김씨",
    region: "경기 성남시",
    sellerLevel: 2,
    buyerLevel: 5,
    isSuspended: false,
    recentPenaltyCount: 2,
    reportedCount: 3,
    joinedAt: "2026-01-04T14:05:00+09:00",
  },
  {
    id: "u_1003",
    nickname: "부산갈매기",
    region: "부산 해운대구",
    sellerLevel: 3,
    buyerLevel: 2,
    isSuspended: true,
    recentPenaltyCount: 3,
    reportedCount: 5,
    joinedAt: "2025-12-20T11:40:00+09:00",
  },
  {
    id: "u_1004",
    nickname: "알뜰소비러",
    region: "인천 연수구",
    sellerLevel: 1,
    buyerLevel: 4,
    isSuspended: false,
    recentPenaltyCount: 0,
    reportedCount: 1,
    joinedAt: "2026-05-02T18:15:00+09:00",
  },
  {
    id: "u_1005",
    nickname: "레트로수집가",
    region: "대구 수성구",
    sellerLevel: 5,
    buyerLevel: 1,
    isSuspended: false,
    recentPenaltyCount: 1,
    reportedCount: 0,
    joinedAt: "2025-11-08T08:00:00+09:00",
  },
  {
    id: "u_1006",
    nickname: "새싹판매자",
    region: "광주 서구",
    sellerLevel: 1,
    buyerLevel: 1,
    isSuspended: false,
    recentPenaltyCount: 0,
    reportedCount: 0,
    joinedAt: "2026-07-01T21:30:00+09:00",
  },
  {
    id: "u_1007",
    nickname: "분쟁유발자",
    region: "서울 마포구",
    sellerLevel: 2,
    buyerLevel: 2,
    isSuspended: true,
    recentPenaltyCount: 4,
    reportedCount: 7,
    joinedAt: "2025-10-15T13:22:00+09:00",
  },
  {
    id: "u_1008",
    nickname: "성실거래러",
    region: "대전 유성구",
    sellerLevel: 3,
    buyerLevel: 3,
    isSuspended: false,
    recentPenaltyCount: 0,
    reportedCount: 0,
    joinedAt: "2026-02-27T10:10:00+09:00",
  },
];

/** 상세 화면용 부가 이력 (회원별). 목록에 없는 평판/이력만 별도 보관 */
const MEMBER_DETAIL_EXTRA: Record<
  string,
  {
    avatarUrl: string | null;
    sellerAvgScore: number;
    buyerAvgScore: number;
    completedSalesCount: number;
    completedPurchasesCount: number;
    suspensions: UserSuspension[];
    penalties: Penalty[];
    actionLogs: AdminActionLog[];
  }
> = {
  u_1003: {
    avatarUrl: null,
    sellerAvgScore: 6.4,
    buyerAvgScore: 7.1,
    completedSalesCount: 12,
    completedPurchasesCount: 5,
    suspensions: [
      {
        id: "sus_01",
        userId: "u_1003",
        reason: "허위 상품 정보 반복 등록",
        suspendedBy: "u_1001",
        startsAt: "2026-06-28T10:00:00+09:00",
        endsAt: "2026-07-12T10:00:00+09:00",
        liftedAt: null,
      },
    ],
    penalties: [
      {
        id: "pen_01",
        userId: "u_1003",
        reason: "abandon_won",
        createdAt: "2026-06-10T15:00:00+09:00",
      },
      {
        id: "pen_02",
        userId: "u_1003",
        reason: "withdraw_with_bids",
        createdAt: "2026-06-22T09:30:00+09:00",
      },
      {
        id: "pen_03",
        userId: "u_1003",
        reason: "abandon_won",
        createdAt: "2026-06-27T20:15:00+09:00",
      },
    ],
    actionLogs: [
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
    ],
  },
  u_1007: {
    avatarUrl: null,
    sellerAvgScore: 4.2,
    buyerAvgScore: 5.0,
    completedSalesCount: 8,
    completedPurchasesCount: 9,
    suspensions: [
      {
        id: "sus_02",
        userId: "u_1007",
        reason: "거래 분쟁 다수 · 욕설 신고",
        suspendedBy: "u_1001",
        startsAt: "2026-07-02T09:00:00+09:00",
        endsAt: null,
        liftedAt: null,
      },
    ],
    penalties: [
      {
        id: "pen_04",
        userId: "u_1007",
        reason: "abandon_won",
        createdAt: "2026-06-15T11:00:00+09:00",
      },
      {
        id: "pen_05",
        userId: "u_1007",
        reason: "abandon_won",
        createdAt: "2026-06-20T16:40:00+09:00",
      },
      {
        id: "pen_06",
        userId: "u_1007",
        reason: "withdraw_with_bids",
        createdAt: "2026-06-25T14:10:00+09:00",
      },
      {
        id: "pen_07",
        userId: "u_1007",
        reason: "abandon_won",
        createdAt: "2026-07-01T19:05:00+09:00",
      },
    ],
    actionLogs: [
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
    ],
  },
};

/** 이력 없는 일반 회원의 기본 상세 부가값 */
function defaultExtra(row: AdminMemberRow) {
  return {
    avatarUrl: null,
    sellerAvgScore: row.sellerLevel >= 3 ? 8.2 : 7.0,
    buyerAvgScore: row.buyerLevel >= 3 ? 8.5 : 7.2,
    completedSalesCount: row.sellerLevel * 4,
    completedPurchasesCount: row.buyerLevel * 3,
    suspensions: [] as UserSuspension[],
    penalties: [] as Penalty[],
    actionLogs: [] as AdminActionLog[],
  };
}

/** 목록 행 + 부가 이력을 합쳐 상세 컴포지트 반환. 미존재 id는 null */
export function getMockMemberDetail(id: string): AdminMemberDetail | null {
  const row = MOCK_MEMBERS.find((m) => m.id === id);
  if (!row) return null;
  const extra = MEMBER_DETAIL_EXTRA[id] ?? defaultExtra(row);
  return { ...row, ...extra };
}
