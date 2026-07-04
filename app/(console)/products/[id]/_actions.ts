"use server";

// 상품 조치 Server Action (Phase A5 / TA054, OPEN-2 = 강제내림 + 강제종료)
// admin RPC 는 인증된 관리자 세션(server client)으로 호출한다(service_role 는 auth.uid() NULL로 권한/감사 붕괴).
// 블라인드/해제는 공용 app/(console)/_actions/moderation.ts 참고(상품/메시지/평점 공유).

import { createClient } from "@0625chopin/shared/supabase/server";
import { refresh, revalidatePath } from "next/cache";

/** 상품 강제 내림 (active → withdrawn). FA031 */
export async function forceWithdrawProductAction(
  productId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_force_withdraw_product", {
    p_product_id: productId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/products"); // 목록: 다음 방문 시 fresh
  refresh(); // 현재 상세 페이지 in-place 재렌더(cacheComponents)
}

/** 경매 강제 종료 (active 즉시 낙찰/유찰). 만료 전 강제 종결 — FA032 */
export async function forceCloseAuctionAction(
  productId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_force_close_auction", {
    p_product_id: productId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/products"); // 목록: 다음 방문 시 fresh
  refresh(); // 현재 상세 페이지 in-place 재렌더(cacheComponents)
}
