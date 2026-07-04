// 대시보드 집계 Mock 데이터 (FA010~FA013)
// KPI/추이/카테고리분포/시스템상태/운영위젯 — 실 Supabase 집계(TA050)와 동일 계약.
// 순수 표현 컴포넌트(KpiCard/TrendChart/OpsWidget/SystemStatusCard)의 props 원천.

import type {
  DashboardKpi,
  TrendPoint,
  TrendMetric,
  CategoryDistribution,
  SystemStatus,
} from "@/lib/types";

/** KPI 카드 6종+ (오늘=2026-07-04 기준 스냅샷) */
export const MOCK_DASHBOARD_KPI: DashboardKpi = {
  totalUsers: 1284,
  activeAuctions: 47,
  todaySignups: 8,
  todayAuctions: 12,
  todayBids: 63,
  todayTransactions: 9,
  completionRate: 0.842,
  pendingReports: 5,
  suspendedUsers: 3,
};

// 결정적 추이 생성 (Math.random 미사용 — Mock 안정성). 2026-06-21~07-04 14일.
function buildTrend(base: number, amp: number, phase = 0): TrendPoint[] {
  const days = 14;
  const endDay = 4; // 2026-07-04
  const points: TrendPoint[] = [];
  for (let i = 0; i < days; i++) {
    // 6월 21일부터 시작 → 6월은 21~30(10일), 7월은 1~4
    const dayOfMonth = 21 + i;
    const month = dayOfMonth <= 30 ? 6 : 7;
    const dom = dayOfMonth <= 30 ? dayOfMonth : dayOfMonth - 30;
    const date = `2026-${String(month).padStart(2, "0")}-${String(dom).padStart(2, "0")}`;
    // 완만한 사인 파형 + 주말(모듈로) 가중으로 결정적 변동
    const wave = Math.sin((i + phase) / 2.2);
    const weekendBoost = (i + endDay) % 7 < 2 ? amp * 0.4 : 0;
    const value = Math.max(
      0,
      Math.round(base + wave * amp + weekendBoost + (i % 3))
    );
    points.push({ date, value });
  }
  return points;
}

/** 지표별 일별 추이 (기간 토글 시 slice 하여 사용) */
export const MOCK_TREND: Record<TrendMetric, TrendPoint[]> = {
  signups: buildTrend(9, 4, 0),
  auctions: buildTrend(14, 6, 1),
  transactions: buildTrend(8, 3, 2),
  gmv: buildTrend(320, 120, 0).map((p) => ({
    ...p,
    value: p.value * 10000, // 원 단위 GMV
  })),
};

/** 카테고리별 상품/경매 분포 (도넛/막대) */
export const MOCK_CATEGORY_DIST: CategoryDistribution[] = [
  { category: "digital", categoryLabel: "디지털/가전", count: 142 },
  { category: "fashion", categoryLabel: "패션/의류", count: 98 },
  { category: "furniture", categoryLabel: "가구/인테리어", count: 61 },
  { category: "hobby", categoryLabel: "취미/게임", count: 54 },
  { category: "beauty", categoryLabel: "뷰티/미용", count: 33 },
  { category: "etc", categoryLabel: "기타", count: 27 },
];

/** 시스템 상태 (pg_cron 잡 + Storage 개요) — FA013 */
export const MOCK_SYSTEM_STATUS: SystemStatus = {
  cronJobs: [
    {
      jobName: "close-expired-auctions",
      active: true,
      lastRunAt: "2026-07-04T15:00:00+09:00",
      lastSucceeded: true,
    },
    {
      jobName: "auto-complete-transactions",
      active: true,
      lastRunAt: "2026-07-04T15:00:00+09:00",
      lastSucceeded: true,
    },
  ],
  storageObjectCount: 3412,
};

/** 운영 위젯 행 (마감임박/자동완료대기/최근신고/최근가입 공통 형태) */
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

/** 마감 임박 경매 (남은 시간 오름차순) */
export const MOCK_CLOSING_AUCTIONS: OpsWidgetItem[] = [
  { id: "p_2001", label: "아이폰 15 Pro 256GB", meta: "12분 남음", href: "/products/p_2001" },
  { id: "p_2014", label: "닌텐도 스위치 OLED", meta: "38분 남음", href: "/products/p_2014" },
  { id: "p_2007", label: "캠핑 텐트 4인용", meta: "1시간 20분 남음", href: "/products/p_2007" },
];

/** 자동완료 대기 거래 (24h 경과 임박) */
export const MOCK_AUTO_COMPLETE_WAITING: OpsWidgetItem[] = [
  { id: "t_3002", label: "다이슨 청소기 거래", meta: "완료까지 2시간", href: "/transactions/t_3002" },
  { id: "t_3005", label: "기계식 키보드 거래", meta: "완료까지 5시간", href: "/transactions/t_3005" },
];

/** 최근 신고 (접수 최신순) */
export const MOCK_RECENT_REPORTS: OpsWidgetItem[] = [
  { id: "r_5001", label: "허위 상품 정보 신고", meta: "5분 전 · 상품", href: "/reports" },
  { id: "r_5002", label: "욕설 채팅 신고", meta: "22분 전 · 메시지", href: "/reports" },
  { id: "r_5003", label: "미거래 판매자 신고", meta: "1시간 전 · 사용자", href: "/reports" },
];

/** 최근 가입 회원 (가입 최신순) */
export const MOCK_RECENT_SIGNUPS: OpsWidgetItem[] = [
  { id: "u_1006", label: "새싹판매자", meta: "3시간 전 · 광주 서구", href: "/users/u_1006" },
  { id: "u_1004", label: "알뜰소비러", meta: "1일 전 · 인천 연수구", href: "/users/u_1004" },
];
