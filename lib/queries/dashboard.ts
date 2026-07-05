// 대시보드 실데이터 조회 (Phase A5 / TA050)
// Mock(lib/mocks/admin/dashboard)과 동일한 도메인 계약(lib/types)을 반환해 UI 무수정 전환을 보장한다.
//
// 관리자 콘솔 대시보드는 auth.users(가입일)·cron(잡)·storage(개요)·GROUP BY 집계가 필요해
// 일반 authenticated RLS로는 접근 불가하다. 따라서 SECURITY DEFINER + is_admin() 게이트 RPC
// (get_admin_dashboard_kpi/trend/ops/system_status, 마이그레이션 admin_a5_dashboard_rpcs)로 조회한다.
// (service_role 직접 읽기는 원칙상 금지 — createAdminClient는 강제/제재 mutation 한정)

import { createClient } from "@0625chopin/shared/supabase/server";
import type {
  DashboardKpi,
  TrendMetric,
  TrendPoint,
  SystemStatus,
  OpsWidgetItem,
} from "@/lib/types";
import { formatTimeUntil, formatRelativeTime } from "@/lib/format-admin";
import { REPORT_TARGET_LABEL, labelOf } from "@/lib/labels-admin";
import { fetchReasonLabels } from "./codes";
import type { ReportTargetType } from "@/lib/types";

/** 대시보드 운영 위젯 4종 묶음 (OpsWidget props 원천) */
export interface DashboardOps {
  closingAuctions: OpsWidgetItem[];
  autoCompleteWaiting: OpsWidgetItem[];
  recentReports: OpsWidgetItem[];
  recentSignups: OpsWidgetItem[];
}

// ── RPC raw 계약 (get_admin_dashboard_* 가 반환하는 Json 형태) ──
interface RawTrendPoint {
  date: string;
  signups: number;
  auctions: number;
  transactions: number;
  gmv: number;
}
interface RawOps {
  closingAuctions: { id: string; title: string; auctionEndsAt: string }[];
  autoCompleteWaiting: { id: string; title: string; autoCompleteAt: string }[];
  recentReports: {
    id: string;
    reason: string;
    targetType: ReportTargetType;
    createdAt: string;
  }[];
  recentSignups: {
    id: string;
    nickname: string;
    region: string | null;
    createdAt: string;
  }[];
}

/** KPI 9필드 (FA010) — get_admin_dashboard_kpi */
export async function getDashboardKpi(): Promise<DashboardKpi> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_dashboard_kpi");
  if (error) throw error;
  const k = data as unknown as DashboardKpi;
  // jsonb 수치는 JS number 로 역직렬화되나, 방어적으로 Number() 코어싱.
  return {
    totalUsers: Number(k.totalUsers ?? 0),
    activeAuctions: Number(k.activeAuctions ?? 0),
    todaySignups: Number(k.todaySignups ?? 0),
    todayAuctions: Number(k.todayAuctions ?? 0),
    todayBids: Number(k.todayBids ?? 0),
    todayTransactions: Number(k.todayTransactions ?? 0),
    completionRate: Number(k.completionRate ?? 0),
    pendingReports: Number(k.pendingReports ?? 0),
    suspendedUsers: Number(k.suspendedUsers ?? 0),
  };
}

/** 일별 추이 (FA011) — get_admin_dashboard_trend. Record<TrendMetric, TrendPoint[]> 로 재구성 */
export async function getDashboardTrend(
  days = 14
): Promise<Record<TrendMetric, TrendPoint[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_dashboard_trend", {
    p_days: days,
  });
  if (error) throw error;
  const rows = (data as unknown as RawTrendPoint[]) ?? [];
  const pick = (metric: keyof RawTrendPoint): TrendPoint[] =>
    rows.map((r) => ({ date: r.date, value: Number(r[metric] ?? 0) }));
  return {
    signups: pick("signups"),
    auctions: pick("auctions"),
    transactions: pick("transactions"),
    gmv: pick("gmv"),
  };
}

/** 운영 위젯 4종 (FA012) — get_admin_dashboard_ops. 표시 문자열은 여기(TS)에서 조립 */
export async function getDashboardOps(): Promise<DashboardOps> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_dashboard_ops");
  if (error) throw error;
  const raw = data as unknown as RawOps;
  // 신고 사유 라벨은 공통코드(codes.report_reason)에서 조회 — FO 신고 모달과 단일 소스.
  const reasonLabels = await fetchReasonLabels();
  return {
    closingAuctions: (raw.closingAuctions ?? []).map((a) => ({
      id: a.id,
      label: a.title,
      meta: formatTimeUntil(a.auctionEndsAt),
      href: `/products/${a.id}`,
    })),
    autoCompleteWaiting: (raw.autoCompleteWaiting ?? []).map((t) => ({
      id: t.id,
      label: `${t.title} 거래`,
      meta: `자동완료 ${formatTimeUntil(t.autoCompleteAt)}`,
      href: `/transactions/${t.id}`,
    })),
    recentReports: (raw.recentReports ?? []).map((r) => ({
      id: r.id,
      label: labelOf(reasonLabels, r.reason),
      meta: `${formatRelativeTime(r.createdAt)} · ${labelOf(REPORT_TARGET_LABEL, r.targetType)}`,
      href: "/reports",
    })),
    recentSignups: (raw.recentSignups ?? []).map((u) => ({
      id: u.id,
      label: u.nickname,
      meta: u.region
        ? `${formatRelativeTime(u.createdAt)} · ${u.region}`
        : formatRelativeTime(u.createdAt),
      href: `/users/${u.id}`,
    })),
  };
}

/** 시스템 상태 (FA013) — get_admin_system_status */
export async function getSystemStatus(): Promise<SystemStatus> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_system_status");
  if (error) throw error;
  const s = data as unknown as SystemStatus;
  return {
    cronJobs: (s.cronJobs ?? []).map((j) => ({
      jobName: j.jobName,
      active: j.active,
      lastRunAt: j.lastRunAt,
      lastSucceeded: j.lastSucceeded,
    })),
    storageObjectCount: Number(s.storageObjectCount ?? 0),
  };
}
