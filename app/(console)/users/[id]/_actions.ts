"use server";

// 회원 조치 Server Action (Phase A5 / TA052)
// admin RPC 는 인증된 관리자 세션(server client)으로 호출한다. service_role 로 호출하면
// auth.uid() 가 NULL 이 되어 권한검증·감사로그(admin_id=누가)가 깨진다.
// RPC 내부에서 ① _require_admin ② 상태전이 ③ admin_action_logs 적재를 단일 트랜잭션으로 처리한다.

import { createClient } from "@0625chopin/shared/supabase/server";
import { refresh, revalidatePath } from "next/cache";

/** 계정 정지 (영구 — 기간제는 후속 기간 입력 UI 도입 시 확장). FA022 */
export async function suspendUserAction(
  userId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_suspend_user", {
    p_user_id: userId,
    p_reason: reason,
    // p_ends_at 미전달 → 영구 정지(NULL)
  });
  if (error) throw new Error(error.message);
  revalidatePath("/users"); // 목록: 다음 방문 시 fresh
  refresh(); // 현재 상세 페이지 in-place 재렌더(cacheComponents)
}

/** 정지 해제 (활성 정지 전체 lifted 처리). FA022 */
export async function liftSuspensionAction(
  userId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_lift_suspension", {
    p_user_id: userId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/users"); // 목록: 다음 방문 시 fresh
  refresh(); // 현재 상세 페이지 in-place 재렌더(cacheComponents)
}

/** 패널티 수동 부여 (penalty_type='manual'). 30일 3회 누적은 경매 등록 시 차단(ISSUE-004). FA024 */
export async function grantPenaltyAction(
  userId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_grant_penalty", {
    p_user_id: userId,
    p_reason: reason,
    // p_penalty_type 미전달 → 'manual'
  });
  if (error) throw new Error(error.message);
  revalidatePath("/users"); // 목록: 다음 방문 시 fresh
  refresh(); // 현재 상세 페이지 in-place 재렌더(cacheComponents)
}

/** 패널티 회수 (penalties delete). FA024 */
export async function revokePenaltyAction(
  penaltyId: string,
  userId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_revoke_penalty", {
    p_penalty_id: penaltyId,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/users"); // 목록: 다음 방문 시 fresh
  refresh(); // 현재 상세 페이지 in-place 재렌더(cacheComponents)
}
