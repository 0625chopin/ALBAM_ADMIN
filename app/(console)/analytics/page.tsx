import { Download } from "lucide-react";
import { Badge } from "@0625chopin/shared/ui/badge";
import { Button } from "@0625chopin/shared/ui/button";
import { TrendChart, AdminTable, type AdminTableColumn } from "@/components/admin";
import { MOCK_TREND, MOCK_CATEGORY_DIST } from "@/lib/mocks/admin";
import { formatCount } from "@/lib/format-admin";
import type { CategoryDistribution } from "@/lib/types";

// 심화 통계 (FA090) `3차(선택)` — 기간별 추이·카테고리 분포·CSV 내보내기. Mock.
export default function AnalyticsPage() {
  const totalCount = MOCK_CATEGORY_DIST.reduce((s, c) => s + c.count, 0);

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
      render: (c) => `${((c.count / totalCount) * 100).toFixed(1)}%`,
    },
  ];

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

      <section>
        <TrendChart
          title="기간별 추이 (가입·경매·거래·GMV)"
          series={[
            { key: "signups", label: "가입", color: "var(--chart-1, #2563eb)", points: MOCK_TREND.signups },
            { key: "auctions", label: "경매", color: "var(--chart-2, #16a34a)", points: MOCK_TREND.auctions },
            { key: "transactions", label: "거래", color: "var(--chart-3, #f59e0b)", points: MOCK_TREND.transactions },
          ]}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-muted-foreground text-sm font-semibold">
          카테고리별 분포
        </h2>
        <AdminTable
          columns={columns}
          rows={MOCK_CATEGORY_DIST}
          getRowKey={(c) => c.category}
        />
      </section>
    </div>
  );
}
