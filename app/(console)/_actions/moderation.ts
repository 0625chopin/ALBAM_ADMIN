"use server";

// 공용 콘텐츠 블라인드/해제 Server Action (OPEN-2 제재수단 / OPEN-6 채팅)
// admin_blind_content / admin_unblind_content 를 인증된 관리자 세션(server client)으로 호출한다.
// service_role 로 호출하면 auth.uid() 가 NULL 이 되어 _require_admin 권한검증·감사로그가 깨진다.
// RPC 내부에서 ① _require_admin ② is_blinded 전이 ③ admin_action_logs 적재를 단일 트랜잭션으로 처리.

import { createClient } from "@0625chopin/shared/supabase/server";
import { refresh, revalidatePath } from "next/cache";

export type BlindTargetType = "product" | "message" | "rating";

// 블라인드 대상 유형 → 갱신 경로 매핑
const REVALIDATE_PATH: Record<BlindTargetType, string> = {
  product: "/products",
  message: "/chat",
  rating: "/ratings",
};

/** 콘텐츠 블라인드 (is_blinded=true). 상태(삭제)는 유지하고 노출만 숨김 — FA031/FA070/FA080 */
export async function blindContentAction(
  targetType: BlindTargetType,
  targetId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_blind_content", {
    p_target_type: targetType,
    p_target_id: targetId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  revalidatePath(REVALIDATE_PATH[targetType]); // 목록/대상 경로: 다음 방문 시 fresh
  refresh(); // 현재 페이지 in-place 재렌더(cacheComponents)
}

/** 블라인드 해제(복구). 감사/복구 목적 — 동일 감사 action_type='blind_content' + meta{blinded:false} */
export async function unblindContentAction(
  targetType: BlindTargetType,
  targetId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_unblind_content", {
    p_target_type: targetType,
    p_target_id: targetId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  revalidatePath(REVALIDATE_PATH[targetType]); // 목록/대상 경로: 다음 방문 시 fresh
  refresh(); // 현재 페이지 in-place 재렌더(cacheComponents)
}
