// 거래 관리 실데이터 조회 (Phase A5 / TA051)
// 거래는 auth.users 가 불필요하다. 관리자 전체 조회는 TA051 에서 추가한 admin SELECT RLS
// (transactions_select_admin) 로 허용되므로 RLS 준수 server client 로 조회한다.
// 상품 제목·당사자 닉네임은 products/profiles 조인, 자동완료 예정 시각은 codes.policy 기준 파생.

import { createClient } from "@0625chopin/shared/supabase/server";
import type {
  AdminTransactionRow,
  AdminTransactionDetail,
  TransactionStatus,
} from "@/lib/types";

const UNKNOWN_USER = "이름 없음";
const DELETED_PRODUCT = "삭제된 상품";
const DEFAULT_AUTO_COMPLETE_HOURS = 24;

/** 거래 목록 (FA040) */
export async function getTransactions(): Promise<AdminTransactionRow[]> {
  const supabase = await createClient();

  const { data: txs, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!txs || txs.length === 0) return [];

  const productIds = [...new Set(txs.map((t) => t.product_id))];
  const userIds = [...new Set(txs.flatMap((t) => [t.seller_id, t.buyer_id]))];

  const [{ data: products }, { data: profiles }] = await Promise.all([
    supabase.from("products").select("id, title").in("id", productIds),
    supabase.from("profiles").select("id, nickname").in("id", userIds),
  ]);

  const titleMap = new Map((products ?? []).map((p) => [p.id, p.title]));
  const nickMap = new Map((profiles ?? []).map((p) => [p.id, p.nickname]));

  return txs.map((t) => ({
    id: t.id,
    productId: t.product_id,
    productTitle: titleMap.get(t.product_id) ?? DELETED_PRODUCT,
    sellerId: t.seller_id,
    sellerNickname: nickMap.get(t.seller_id) ?? UNKNOWN_USER,
    buyerId: t.buyer_id,
    buyerNickname: nickMap.get(t.buyer_id) ?? UNKNOWN_USER,
    finalPrice: t.final_price,
    status: t.status as TransactionStatus,
    createdAt: t.created_at,
  }));
}

/** 거래 상세 (FA041) — 미존재 id 는 null */
export async function getTransactionDetail(
  id: string
): Promise<AdminTransactionDetail | null> {
  const supabase = await createClient();

  const { data: t, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!t) return null;

  const [{ data: product }, { data: seller }, { data: buyer }, waitHours] =
    await Promise.all([
      supabase
        .from("products")
        .select("title")
        .eq("id", t.product_id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("nickname")
        .eq("id", t.seller_id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("nickname")
        .eq("id", t.buyer_id)
        .maybeSingle(),
      getAutoCompleteWaitHours(supabase),
    ]);

  // 자동완료 예정: pending 인 경우만 created_at + 정책 대기시간 (ISSUE-002)
  const autoCompleteAt =
    t.status === "pending"
      ? new Date(
          new Date(t.created_at).getTime() + waitHours * 3600_000
        ).toISOString()
      : null;

  // 진행 이력: transactions 에 상태전이 타임스탬프 컬럼이 없으므로 생성 시점만 확정 기록.
  const timeline: { at: string; label: string }[] = [
    { at: t.created_at, label: "낙찰 성립 (거래 생성)" },
  ];

  return {
    id: t.id,
    productId: t.product_id,
    productTitle: product?.title ?? DELETED_PRODUCT,
    sellerId: t.seller_id,
    sellerNickname: seller?.nickname ?? UNKNOWN_USER,
    buyerId: t.buyer_id,
    buyerNickname: buyer?.nickname ?? UNKNOWN_USER,
    finalPrice: t.final_price,
    status: t.status as TransactionStatus,
    createdAt: t.created_at,
    // 분쟁 사유 전용 컬럼은 스키마에 없음(신고 target_type 에 transaction 미포함) → null
    disputeReason: null,
    autoCompleteAt,
    timeline,
  };
}

/** codes.policy.auto_complete_wait_hours (없으면 기본 24h) */
async function getAutoCompleteWaitHours(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<number> {
  const { data } = await supabase
    .from("codes")
    .select("num_value")
    .eq("group_key", "policy")
    .eq("code", "auto_complete_wait_hours")
    .maybeSingle();
  return data?.num_value ?? DEFAULT_AUTO_COMPLETE_HOURS;
}
