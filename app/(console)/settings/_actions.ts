"use server";

// 운영 설정 Server Action (Phase A5 / TA056 정책)
// admin RPC 는 인증된 관리자 세션(server client)으로 호출한다(service_role 는 auth.uid() NULL로 권한/감사 붕괴).
// admin_update_policy 는 정책 단일소스(codes.policy) 갱신 + 범위 검증(거부) + 감사로그를 단일 트랜잭션으로 수행.

import { createClient } from "@0625chopin/shared/supabase/server";
import { refresh } from "next/cache";

/** 정책 수치 변경 (범위 밖 값은 RPC 가 거부). FA061 */
export async function updatePolicyAction(
  code: string,
  numValue: number,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_update_policy", {
    p_code: code,
    p_num_value: numValue,
    p_reason: reason,
  });
  if (error) throw new Error(error.message);
  refresh(); // 현재 운영 설정 페이지 in-place 재렌더(cacheComponents)
}
