"use server";

// 신고 처리 Server Action (Phase A5 / TA056, FA051)
// admin RPC 는 인증된 관리자 세션(server client)으로 호출한다. service_role 로 호출하면
// auth.uid() 가 NULL 이 되어 권한검증·감사로그(admin_id=누가)가 깨진다.
// admin_resolve_report 내부에서 ① _require_admin ② reports 상태전이 ③ admin_action_logs 적재를
// 단일 트랜잭션으로 처리한다.

import { createClient } from "@0625chopin/shared/supabase/server";
import { refresh } from "next/cache";

/** 신고 처리(resolved) / 반려(rejected). 종결 처리는 사유 메모 필수(RPC 내부 검증). */
export async function resolveReportAction(
  reportId: string,
  status: "resolved" | "rejected",
  resolution: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_resolve_report", {
    p_report_id: reportId,
    p_status: status,
    p_resolution: resolution,
  });
  if (error) throw new Error(error.message);
  refresh(); // 현재 신고 목록 페이지 in-place 재렌더(cacheComponents)
}
