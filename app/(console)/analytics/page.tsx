import { Suspense } from "react";
import { Download } from "lucide-react";
import { Badge } from "@0625chopin/shared/ui/badge";
import { Button } from "@0625chopin/shared/ui/button";
import {
  TrendChart,
  AdminTable,
  type AdminTableColumn,
} from "@/components/admin";
import {
  getAnalyticsTrend,
  getCategoryDistribution,
} from "@/lib/queries/analytics";
import { formatCount } from "@/lib/format-admin";
import type { CategoryDistribution } from "@/lib/types";

// 심화 통계 (FA090) `3차(선택)` — 기간별 추이·카테고리 분포·CSV 내보내기.
// 실 Supabase 조회(FA090): 추이는 대시보드 추이 RPC 재사용, 카테고리 분포는 products 집계. UI 무수정.
// cacheComponents: 동적(쿠키 기반) 조회는 Suspense 안 async 자식에서 수행.
export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-foreground text-xl font-bold">심화 통계</h1>
          <Badge variant="outline">3차</Badge>
        </div>
        <Button variant="outline" size="sm">
          <Download className="size-4" />
          CSV 내보내기
        </Button>
      </header>

      <Suspense
        fallback={<p className="text-muted-foreground text-sm">불러오는 중…</p>}
      >
        <AnalyticsData />
      </Suspense>
    </div>
  );
}

// 조회부: 기간별 추이 + 카테고리 분포를 병렬 조회 후 표현 컴포넌트에 주입.
async function AnalyticsData() {
  const [trend, dist] = await Promise.all([
    getAnalyticsTrend(),
    getCategoryDistribution(),
  ]);

  const totalCount = dist.reduce((s, c) => s + c.count, 0);

  const columns: AdminTableColumn<CategoryDistribution>[] = [
    { key: "categoryLabel", header: "카테고리" },
    {
      key: "count",
      header: "상품 수",
      align: "right",
      render: (c) => formatCount(c.count),
    },
    {
      key: "ratio",
      header: "비중",
      align: "right",
      render: (c) =>
        totalCount > 0 ? `${((c.count / totalCount) * 100).toFixed(1)}%` : "-",
    },
  ];

  return (
    <>
      <section>
        <TrendChart
          title="기간별 추이 (가입·경매·거래·GMV)"
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

      <section className="space-y-2">
        <h2 className="text-muted-foreground text-sm font-semibold">
          카테고리별 분포
        </h2>
        <AdminTable
          columns={columns}
          rows={dist}
          getRowKey={(c) => c.category}
        />
      </section>
    </>
  );
}
