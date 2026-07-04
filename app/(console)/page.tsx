import { Suspense } from "react";
import {
  KpiCard,
  TrendChart,
  OpsWidget,
  SystemStatusCard,
} from "@/components/admin";
import { CardsSkeleton } from "@/components/admin/skeleton-blocks";
import {
  getDashboardKpi,
  getDashboardTrend,
  getDashboardOps,
  getSystemStatus,
} from "@/lib/queries/dashboard";
import { formatPercent, formatCount } from "@/lib/format-admin";

// 관리자 대시보드 (FA010~FA013) — 실 Supabase 집계(TA050).
// UI 컴포넌트(KpiCard/TrendChart/OpsWidget/SystemStatusCard)는 무수정, 데이터 소스만 Mock→조회 교체.
// cacheComponents: 동적(쿠키 기반) 조회는 Suspense 안 async 자식에서 수행(ISSUE-011).
export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-foreground text-xl font-bold">대시보드</h1>
        <p className="text-muted-foreground text-sm">운영 현황 요약</p>
      </header>

      <Suspense fallback={<CardsSkeleton count={6} />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}

// 조회부: KPI/추이/운영위젯/시스템상태를 병렬 조회 후 순수 표현 컴포넌트에 주입.
async function DashboardData() {
  const [k, trend, ops, systemStatus] = await Promise.all([
    getDashboardKpi(),
    getDashboardTrend(14),
    getDashboardOps(),
    getSystemStatus(),
  ]);

  return (
    <>
      {/* KPI 카드 6종 (FA010) — 클릭 시 해당 목록 이동 */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard
          label="총 회원수"
          value={k.totalUsers}
          hint="전체 가입 회원"
          href="/users"
        />
        <KpiCard
          label="진행중 경매"
          value={k.activeAuctions}
          hint="상태 active"
          href="/products"
        />
        <KpiCard
          label="오늘 신규 가입"
          value={k.todaySignups}
          hint={`경매 ${formatCount(k.todayAuctions)} · 입찰 ${formatCount(k.todayBids)} · 거래 ${formatCount(k.todayTransactions)}`}
        />
        <KpiCard
          label="거래 완료율"
          value={formatPercent(k.completionRate)}
          hint="완료+자동완료 / 전체"
        />
        <KpiCard
          label="미처리 신고"
          value={k.pendingReports}
          hint="상태 pending"
          href="/reports"
        />
        <KpiCard
          label="제재중 회원"
          value={k.suspendedUsers}
          hint="활성 정지"
          href="/users"
        />
      </section>

      {/* 추이 차트 (FA011) */}
      <section>
        <TrendChart
          title="일별 추이"
          series={[
            {
              key: "signups",
              label: "가입",
              color: "var(--chart-1, #2563eb)",
              points: trend.signups,
            },
            {
              key: "auctions",
              label: "경매",
              color: "var(--chart-2, #16a34a)",
              points: trend.auctions,
            },
            {
              key: "transactions",
              label: "거래",
              color: "var(--chart-3, #f59e0b)",
              points: trend.transactions,
            },
          ]}
        />
      </section>

      {/* 운영 위젯 (FA012) */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OpsWidget
          title="마감 임박 경매"
          items={ops.closingAuctions}
          emptyMessage="마감 임박 경매 없음"
        />
        <OpsWidget
          title="자동완료 대기 거래"
          items={ops.autoCompleteWaiting}
          emptyMessage="대기 거래 없음"
        />
        <OpsWidget
          title="최근 신고"
          items={ops.recentReports}
          emptyMessage="최근 신고 없음"
        />
        <OpsWidget
          title="최근 가입"
          items={ops.recentSignups}
          emptyMessage="최근 가입 없음"
        />
      </section>

      {/* 시스템 상태 (FA013, 2차) */}
      <section className="md:max-w-md">
        <SystemStatusCard status={systemStatus} />
      </section>
    </>
  );
}
