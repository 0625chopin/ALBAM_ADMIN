// DB Row(snake_case) → 관리자 도메인 타입(camelCase) 변환 어댑터 (ISSUE-012)
// 관리자 전용 신규 테이블(admin_users/reports/admin_action_logs/user_suspensions)의 순수 1:1 매퍼.
// 공유 도메인 매퍼(toProfile/toProduct 등)는 @0625chopin/shared/queries/map 재사용.
// 목록/상세 파생(조인·집계) 매퍼는 실제 조회 쿼리와 함께 A5(TA050/TA051)에서 작성한다.
//
// UI/Mock 과 동일한 camelCase 계약(lib/types)을 반환해, 실데이터 전환 시 UI 무수정을 보장한다.

import type { Tables } from "@0625chopin/shared/database";
import type {
  AdminUser,
  Report,
  ReportTargetType,
  ReportStatus,
  AdminActionLog,
  AdminActionType,
  AdminTargetType,
  UserSuspension,
} from "@/lib/types";

/** DB admin_users Row → 도메인 AdminUser (FA001) */
export function toAdminUser(row: Tables<"admin_users">): AdminUser {
  return {
    userId: row.user_id,
    role: row.role,
    grantedBy: row.granted_by,
    grantedAt: row.granted_at,
  };
}

/** DB reports Row → 도메인 Report (FA050~FA052) */
export function toReport(row: Tables<"reports">): Report {
  return {
    id: row.id,
    reporterId: row.reporter_id,
    // target_type/status 는 DB text(+CHECK) → 도메인 리터럴 유니온으로 캐스팅(값 집합 동일)
    targetType: row.target_type as ReportTargetType,
    targetId: row.target_id,
    reason: row.reason,
    detail: row.detail,
    status: row.status as ReportStatus,
    handledBy: row.handled_by,
    resolution: row.resolution,
    createdAt: row.created_at,
    handledAt: row.handled_at,
  };
}

/** DB admin_action_logs Row → 도메인 AdminActionLog (FA002 감사 로그) */
export function toAdminActionLog(
  row: Tables<"admin_action_logs">
): AdminActionLog {
  return {
    id: row.id,
    adminId: row.admin_id,
    actionType: row.action_type as AdminActionType,
    targetType: row.target_type as AdminTargetType,
    targetId: row.target_id,
    reason: row.reason,
    // meta 는 jsonb(Json|null) → 도메인 계약은 Record<string, unknown> | null
    meta: (row.meta as Record<string, unknown> | null) ?? null,
    createdAt: row.created_at,
  };
}

/** DB user_suspensions Row → 도메인 UserSuspension (FA022) */
export function toUserSuspension(
  row: Tables<"user_suspensions">
): UserSuspension {
  return {
    id: row.id,
    userId: row.user_id,
    reason: row.reason,
    suspendedBy: row.suspended_by,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    liftedAt: row.lifted_at,
  };
}
