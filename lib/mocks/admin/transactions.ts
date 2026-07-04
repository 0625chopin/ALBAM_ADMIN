// 거래 관리 Mock 데이터 (FA040/FA041)
// AdminTransactionRow(목록) + AdminTransactionDetail(분쟁 상세) 단일 계약.

import type {
  AdminTransactionRow,
  AdminTransactionDetail,
} from "@/lib/types";

/** 거래 목록 (분쟁/진행중 상단 배치) */
export const MOCK_ADMIN_TRANSACTIONS: AdminTransactionRow[] = [
  {
    id: "t_3001",
    productId: "p_2004",
    productTitle: "허먼밀러 에어론 리마스터드 B사이즈",
    sellerId: "u_1001",
    sellerNickname: "쇼팽마켓",
    buyerId: "u_1008",
    buyerNickname: "성실거래러",
    finalPrice: 810000,
    status: "pending",
    createdAt: "2026-07-03T20:00:00+09:00",
  },
  {
    id: "t_3002",
    productId: "p_2005",
    productTitle: "다이슨 V15 무선청소기 풀구성",
    sellerId: "u_1002",
    sellerNickname: "중고왕김씨",
    buyerId: "u_1004",
    buyerNickname: "알뜰소비러",
    finalPrice: 320000,
    status: "pending",
    createdAt: "2026-07-04T13:00:00+09:00",
  },
  {
    id: "t_3003",
    productId: "p_2003",
    productTitle: "닌텐도 게임보이 컬러 (1998) 정상작동",
    sellerId: "u_1005",
    sellerNickname: "레트로수집가",
    buyerId: "u_1004",
    buyerNickname: "알뜰소비러",
    finalPrice: 88000,
    status: "completed",
    createdAt: "2026-07-02T18:30:00+09:00",
  },
  {
    id: "t_3004",
    productId: "p_2005",
    productTitle: "다이슨 V15 무선청소기 풀구성",
    sellerId: "u_1002",
    sellerNickname: "중고왕김씨",
    buyerId: "u_1008",
    buyerNickname: "성실거래러",
    finalPrice: 300000,
    status: "auto_completed",
    createdAt: "2026-06-29T15:00:00+09:00",
  },
  {
    id: "t_3009",
    productId: "p_2002",
    productTitle: "명품 가방 (정품 보증서 없음)",
    sellerId: "u_1007",
    sellerNickname: "분쟁유발자",
    buyerId: "u_1002",
    buyerNickname: "중고왕김씨",
    finalPrice: 150000,
    status: "canceled",
    createdAt: "2026-06-24T10:00:00+09:00",
  },
];

/** 분쟁/이력 부가 정보 (거래별). 목록에 없는 상세 전용 */
const TX_DETAIL_EXTRA: Record<
  string,
  Pick<AdminTransactionDetail, "disputeReason" | "autoCompleteAt" | "timeline">
> = {
  t_3001: {
    disputeReason: null,
    autoCompleteAt: "2026-07-04T20:00:00+09:00",
    timeline: [
      { at: "2026-07-03T20:00:00+09:00", label: "낙찰 성립 (거래 생성)" },
    ],
  },
  t_3002: {
    disputeReason: "상품 미수령 이의 제기 (구매자)",
    autoCompleteAt: "2026-07-05T13:00:00+09:00",
    timeline: [
      { at: "2026-07-04T14:20:00+09:00", label: "구매자 분쟁 접수" },
      { at: "2026-07-04T13:00:00+09:00", label: "낙찰 성립 (거래 생성)" },
    ],
  },
  t_3009: {
    disputeReason: "판매자 잠적 — 관리자 강제 취소",
    autoCompleteAt: null,
    timeline: [
      { at: "2026-06-25T14:10:00+09:00", label: "관리자 강제 취소 (pending→canceled)" },
      { at: "2026-06-24T10:00:00+09:00", label: "낙찰 성립 (거래 생성)" },
    ],
  },
};

/** 목록 행 + 부가 이력을 합쳐 상세 반환. 미존재 id 는 null */
export function getMockTransactionDetail(
  id: string
): AdminTransactionDetail | null {
  const row = MOCK_ADMIN_TRANSACTIONS.find((t) => t.id === id);
  if (!row) return null;
  const extra = TX_DETAIL_EXTRA[id] ?? {
    disputeReason: null,
    autoCompleteAt: null,
    timeline: [{ at: row.createdAt, label: "낙찰 성립 (거래 생성)" }],
  };
  return { ...row, ...extra };
}
