import { Button } from "@0625chopin/shared/ui/button";
import { Badge } from "@0625chopin/shared/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { StatusBadge } from "@0625chopin/shared/common/status-badge";
import {
  KpiCard,
  AdminTable,
  TrendChart,
  OpsWidget,
  SystemStatusCard,
  AdminActionDialog,
  type AdminTableColumn,
} from "@/components/admin";
import {
  MOCK_DASHBOARD_KPI,
  MOCK_TREND,
  MOCK_SYSTEM_STATUS,
  MOCK_CLOSING_AUCTIONS,
  MOCK_MEMBERS,
} from "@/lib/mocks/admin";
import { formatPercent, formatCount } from "@/lib/format-admin";
import type { AdminMemberRow } from "@/lib/types";

// 관리자 컴포넌트 전시장 — @0625chopin/shared 디자인 시스템 + components/admin/* 순수 컴포넌트 전시.
// ROADMAP_ADMIN A2(TA020). 각 화면은 이 컴포넌트들을 조립해 구성.

const MEMBER_COLUMNS: AdminTableColumn<AdminMemberRow>[] = [
  { key: "nickname", header: "닉네임" },
  { key: "region", header: "지역", className: "text-muted-foreground" },
  {
    key: "sellerLevel",
    header: "판매Lv",
    align: "center",
    render: (m) => `Lv.${m.sellerLevel}`,
  },
  {
    key: "reportedCount",
    header: "신고",
    align: "right",
    render: (m) => formatCount(m.reportedCount),
  },
  {
    key: "isSuspended",
    header: "상태",
    align: "center",
    render: (m) =>
      m.isSuspended ? (
        <Badge variant="destructive">정지</Badge>
      ) : (
        <Badge variant="secondary">정상</Badge>
      ),
  },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-muted-foreground text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function AdminSample() {
  const k = MOCK_DASHBOARD_KPI;
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-foreground text-xl font-bold">/sample — 전시장</h1>

      <Section title="KpiCard (components/admin)">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <KpiCard label="총 회원수" value={k.totalUsers} hint="count(profiles)" href="/users" />
          <KpiCard label="진행중 경매" value={k.activeAuctions} hint="products active" href="/products" />
          <KpiCard label="거래 완료율" value={formatPercent(k.completionRate)} hint="completed / 전체" />
          <KpiCard label="미처리 신고" value={k.pendingReports} hint="reports pending" href="/reports" />
        </div>
      </Section>

      <Section title="TrendChart (recharts, 기간 토글)">
        <TrendChart
          title="일별 추이"
          series={[
            { key: "signups", label: "가입", color: "var(--chart-1, #2563eb)", points: MOCK_TREND.signups },
            { key: "auctions", label: "경매", color: "var(--chart-2, #16a34a)", points: MOCK_TREND.auctions },
            { key: "transactions", label: "거래", color: "var(--chart-3, #f59e0b)", points: MOCK_TREND.transactions },
          ]}
        />
      </Section>

      <Section title="OpsWidget · SystemStatusCard">
        <div className="grid gap-4 md:grid-cols-2">
          <OpsWidget title="마감 임박 경매" items={MOCK_CLOSING_AUCTIONS} />
          <SystemStatusCard status={MOCK_SYSTEM_STATUS} />
        </div>
      </Section>

      <Section title="AdminTable (제네릭 목록)">
        <AdminTable
          columns={MEMBER_COLUMNS}
          rows={MOCK_MEMBERS.slice(0, 5)}
          getRowKey={(m) => m.id}
        />
      </Section>

      <Section title="AdminActionDialog (사유 필수 입력)">
        <div className="flex flex-wrap gap-2">
          <AdminActionDialog
            trigger={<Button variant="destructive">계정 정지</Button>}
            title="계정 정지"
            description="해당 회원의 로그인·거래를 제한합니다."
            actionLabel="정지"
            destructive
            summary="대상: 부산갈매기 (u_1003) · 현재 상태: 정상 → 정지"
          />
          <AdminActionDialog
            trigger={<Button variant="outline">콘텐츠 블라인드</Button>}
            title="콘텐츠 블라인드"
            description="상태는 유지하고 노출만 숨깁니다(감사/복구 목적)."
            actionLabel="블라인드"
            tier={2}
          />
        </div>
      </Section>

      <Section title="StatusBadge (shared/common 재사용)">
        <div className="flex flex-wrap gap-2">
          <StatusBadge kind="product" status="active" label="경매중" />
          <StatusBadge kind="product" status="won" label="낙찰" />
          <StatusBadge kind="transaction" status="pending" label="진행중" />
          <StatusBadge kind="transaction" status="completed" label="거래완료" />
        </div>
      </Section>

      <Section title="Buttons · Badges · Card (shared/ui)">
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>공유 디자인 시스템</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            @0625chopin/shared 의 UI·토큰을 admin 앱이 그대로 소비합니다.
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
