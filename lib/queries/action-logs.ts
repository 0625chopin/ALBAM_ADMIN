// 감사 로그(admin_action_logs) 조회 (Phase A5 / TA058)
// admin_action_logs 는 admin RLS(is_admin() SELECT)로 관리자만 조회 가능하며 불변(update/delete 정책 없음).
// 모든 admin RPC(정지/패널티/강제내림/거래조치 등)가 조치 시 자동 적재한다(누가·언제·무엇을·왜) — FA002.
//
// 참고: 회원 상세의 "조치 이력"은 get_admin_member_detail RPC 가 대상 회원 로그를 인라인으로 반환(실데이터).
// 본 함수는 대상 무관 전역/필터 감사 로그 열람용 재사용 조회이다.

import { createClient } from "@0625chopin/shared/supabase/server";
import { toAdminActionLog } from "./_map";
import type {
  AdminActionLog,
  AdminActionType,
  AdminTargetType,
} from "@/lib/types";

export interface ActionLogFilter {
  /** 조치 유형 필터 (예: 'suspend_user') */
  actionType?: AdminActionType;
  /** 대상 유형 필터 (예: 'user'/'product'/'transaction') */
  targetType?: AdminTargetType;
  /** 특정 대상 id 필터 */
  targetId?: string;
  /** 최대 건수 (기본 100) */
  limit?: number;
}

/** 감사 로그 열람 (최신순). 관리자만 조회 가능(RLS). toAdminActionLog 매퍼 경유. */
export async function getActionLogs(
  filter: ActionLogFilter = {}
): Promise<AdminActionLog[]> {
  const supabase = await createClient();
  let query = supabase
    .from("admin_action_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filter.limit ?? 100);

  if (filter.actionType) query = query.eq("action_type", filter.actionType);
  if (filter.targetType) query = query.eq("target_type", filter.targetType);
  if (filter.targetId) query = query.eq("target_id", filter.targetId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toAdminActionLog);
}
