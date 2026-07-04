"use server";

// 거래 조치 Server Action (Phase A5 / TA055)
// admin RPC 는 인증된 관리자 세션(server client)으로 호출한다(service_role 는 auth.uid() NULL로 권한/감사 붕괴).
// pending 거래만 대상. ISSUE-007(강제 취소는 연쇄 이양 없이 종료)·ISSUE-002(자동완료 24h)와 정합.

import { createClient } from "@0625chopin/shared/supabase/server";
import { refresh, revalidatePath } from "next/cache";

/** 거래 강제 취소 (pending → canceled). FA041 */
export async function forceCancelTransactionAction(
  transactionId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_force_cancel_transaction", {
    p_transaction_id: transactionId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/transactions"); // 목록: 다음 방문 시 fresh
  refresh(); // 현재 상세 페이지 in-place 재렌더(cacheComponents)
}

/** 거래 강제 완료 (pending → completed). FA041 */
export async function forceCompleteTransactionAction(
  transactionId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_force_complete_transaction", {
    p_transaction_id: transactionId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/transactions"); // 목록: 다음 방문 시 fresh
  refresh(); // 현재 상세 페이지 in-place 재렌더(cacheComponents)
}
