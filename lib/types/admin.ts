// 관리자 콘솔 핵심 도메인 타입 (admin 레포 잔류)
// PRD_ADMIN "🗄️ 데이터 모델"의 신규 관리자 테이블을 camelCase로 1:1 매핑한다.
// 공유 도메인 타입(Profile/Product 등)은 @0625chopin/shared/types 에서 소비하고,
// 관리자 전용 신규 엔티티만 본 파일에 정의한다(ADR-0005 §2, TA010).
// Mock 데이터와 실제 DB 데이터가 공유하는 단일 계약(contract)이다.

/**
 * 관리자 계정 (별도 admin_users 테이블 소속으로 판별)
 * - PRD_ADMIN: admin_users / FA001·FA023
 * - 결정(OPEN-5): MVP는 단일 권한. role 컬럼은 확장 여지로만 확보(다단계 로직 미구현).
 */
export interface AdminUser {
  /** 관리자 사용자 식별자 (PK, → profiles.id / auth 사용자 UUID) */
  userId: string;
  /** 권한 역할 (기본 "admin", 단일 권한) */
  role: string;
  /** 지정한 관리자 (→ profiles.id). 최초 부트스트랩 관리자는 null */
  grantedBy: string | null;
  /** 지정 시각 (ISO 8601) */
  grantedAt: string;
}

/**
 * 관리자 조치 대상 유형 (감사 로그/신고 공통)
 * - user: 회원 / product: 상품·경매 / transaction: 거래 / message: 채팅 메시지 /
 *   rating: 평점 / report: 신고 / policy: 정책 수치
 */
export type AdminTargetType =
  | "user"
  | "product"
  | "transaction"
  | "message"
  | "rating"
  | "report"
  | "policy";

/**
 * 관리자 조치 유형 (감사 로그 action_type)
 * - A5의 admin RPC 9종+과 1:1 대응. 2차/후속(신고·정책·관리자지정·닉네임)은 후반 Task.
 */
export type AdminActionType =
  // 회원 제재 (FA022)
  | "suspend_user"
  | "lift_suspension"
  // 패널티 (FA024)
  | "grant_penalty"
  | "revoke_penalty"
  // 상품·경매 강제 조치 (FA031/FA032)
  | "force_withdraw_product"
  | "blind_content"
  | "force_close_auction"
  // 거래 강제 조치 (FA041)
  | "force_cancel_transaction"
  | "force_complete_transaction"
  // 신고 처리 · 정책 (2차, FA051/FA061)
  | "resolve_report"
  | "update_policy"
  // 관리자 관리 · 닉네임 (2차, FA023/FA025)
  | "grant_admin"
  | "revoke_admin"
  | "force_change_nickname";

/**
 * 관리자 조치 감사 로그 (모든 관리자 조치의 책임성 추적: 누가·언제·무엇을·왜)
 * - PRD_ADMIN: admin_action_logs / FA002
 * - 결정(OPEN-3): MVP 필수 포함. 조치 RPC가 상태 전이와 동일 트랜잭션으로 적재(ADR-0005 §3.3).
 */
export interface AdminActionLog {
  /** 고유 식별자 (UUID) */
  id: string;
  /** 조치를 수행한 관리자 (→ profiles.id / admin_users.user_id) */
  adminId: string;
  /** 조치 유형 */
  actionType: AdminActionType;
  /** 조치 대상 유형 */
  targetType: AdminTargetType;
  /** 조치 대상 식별자 (대상 엔티티의 id) */
  targetId: string;
  /** 조치 사유 (필수 입력, AdminActionDialog에서 검증) */
  reason: string;
  /** 조치 부가 정보 (before/after 스냅샷 등, jsonb). 없으면 null */
  meta: Record<string, unknown> | null;
  /** 조치 시각 (ISO 8601) */
  createdAt: string;
}

/**
 * 회원 정지 이력 (기간제/영구, 사유·해제 추적)
 * - PRD_ADMIN: user_suspensions / FA022
 * - 결정(OPEN-4): 별도 테이블로 이력 누적. profiles 컬럼 방식 불채택.
 */
export interface UserSuspension {
  /** 고유 식별자 (UUID) */
  id: string;
  /** 정지 대상 회원 (→ profiles.id) */
  userId: string;
  /** 정지 사유 */
  reason: string;
  /** 정지를 부과한 관리자 (→ profiles.id) */
  suspendedBy: string;
  /** 정지 시작 시각 (ISO 8601) */
  startsAt: string;
  /** 정지 종료 시각 (ISO 8601). 영구 정지는 null */
  endsAt: string | null;
  /** 해제 시각 (ISO 8601). 미해제(정지 유효)는 null */
  liftedAt: string | null;
}

// 신고(Report/ReportTargetType/ReportStatus) 타입은 @0625chopin/shared/types 로 이관됨.
// reports 는 일반 사용자가 직접 insert 하는 특수 테이블(FA050)이라 FO·BO 공유 계약이므로 shared 에 둔다.
// (lib/types/index.ts 에서 shared 로부터 재노출한다.)
