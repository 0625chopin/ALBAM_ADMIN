// 관리자 대시보드 파생 타입 (집계 표현용)
// PRD_ADMIN "📊 대시보드 상세" FA010~FA013. Mock 집계와 실 Supabase 집계(TA050)가 공유하는 계약.
// 순수 표현 컴포넌트(KpiCard/TrendChart/OpsWidget/SystemStatusCard)의 props 형태를 고정한다.

/**
 * 대시보드 KPI 카드 집계 (6종+)
 * - PRD_ADMIN: FA010. 각 값은 위젯 클릭 시 해당 목록으로 이동하는 링크와 연결.
 */
export interface DashboardKpi {
  /** 총 회원수 (count(profiles)) */
  totalUsers: number;
  /** 진행중 경매 (products status='active') */
  activeAuctions: number;
  /** 오늘 신규 가입 (당일 profiles.created_at) */
  todaySignups: number;
  /** 오늘 신규 경매 (당일 products.created_at) */
  todayAuctions: number;
  /** 오늘 신규 입찰 (당일 bids.created_at) */
  todayBids: number;
  /** 오늘 신규 거래 (당일 transactions.created_at) */
  todayTransactions: number;
  /** 거래 완료율 (completed+auto_completed / 전체, 0~1) */
  completionRate: number;
  /** 미처리 신고 수 (reports status='pending') — 신고 2차, MVP는 0 고정 가능 */
  pendingReports: number;
  /** 제재중 회원 수 (활성 user_suspensions) */
  suspendedUsers: number;
}

/**
 * 추이 차트 지표 유형 (일별 추이)
 * - PRD_ADMIN: FA011
 */
export type TrendMetric =
  | "signups"
  | "auctions"
  | "transactions"
  | "gmv";

/**
 * 일별 추이 포인트 (가입·경매·거래·GMV 등)
 * - PRD_ADMIN: FA011. 기간 토글(7일/30일 등)로 배열 길이 조정.
 */
export interface TrendPoint {
  /** 날짜 (ISO 8601 date, "2026-07-04") */
  date: string;
  /** 지표 값 (건수 또는 금액) */
  value: number;
}

/**
 * 카테고리별 분포 (도넛/막대)
 * - PRD_ADMIN: FA011 (카테고리별 분포)
 */
export interface CategoryDistribution {
  /** 카테고리 코드 (codes.category value) */
  category: string;
  /** 카테고리 표시 라벨 */
  categoryLabel: string;
  /** 해당 카테고리 상품/경매 수 */
  count: number;
}

/**
 * pg_cron 잡 실행 상태 (시스템 상태 카드)
 * - PRD_ADMIN: FA013 / ISSUE-008 (close-expired-auctions, auto-complete-transactions)
 */
export interface CronJobStatus {
  /** 잡 이름 (cron.job jobname) */
  jobName: string;
  /** 활성 여부 */
  active: boolean;
  /** 최근 실행 시각 (ISO 8601). 미실행은 null */
  lastRunAt: string | null;
  /** 최근 실행 성공 여부. 미실행은 null */
  lastSucceeded: boolean | null;
}

/**
 * 시스템 상태 카드 집계 (cron 잡 + Storage 개요)
 * - PRD_ADMIN: FA013
 */
export interface SystemStatus {
  /** pg_cron 잡 상태 목록 */
  cronJobs: CronJobStatus[];
  /** Storage 버킷 객체 수 (product-images 등 개요) */
  storageObjectCount: number;
}

/**
 * 운영 위젯 행 (마감임박/자동완료대기/최근신고/최근가입 공통 형태)
 * - PRD_ADMIN: FA012. Mock(lib/mocks/admin/dashboard)과 실 조회(lib/queries/dashboard, TA050)가 공유하는 계약.
 * - OpsWidget 컴포넌트의 props 원천.
 */
export interface OpsWidgetItem {
  /** 행 식별자 */
  id: string;
  /** 주 라벨 (상품 제목·회원 닉네임 등) */
  label: string;
  /** 부가 정보 (남은 시간·금액·사유 등) */
  meta: string;
  /** 클릭 시 이동 경로 (선택) */
  href?: string;
}
