import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";

// 대시보드 골격 (FA010 KPI 카드). Mock 값 — 실데이터/집계는 ROADMAP_ADMIN A2/A5(TA021/TA050).
const KPIS = [
  { label: "총 회원수", value: "—", hint: "count(profiles)" },
  { label: "진행중 경매", value: "—", hint: "products active" },
  { label: "오늘 신규 거래", value: "—", hint: "transactions 당일" },
  { label: "거래 완료율", value: "—", hint: "completed / 전체" },
  { label: "미처리 신고", value: "—", hint: "reports pending" },
  { label: "제재중 회원", value: "—", hint: "user_suspensions" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold">대시보드</h1>
          <p className="text-muted-foreground text-sm">
            운영 현황 요약 (Phase A-1 스캐폴드 · Mock)
          </p>
        </div>
        <Badge variant="secondary">A-1 분리 인프라</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {KPIS.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {k.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-foreground text-2xl font-bold">
                {k.value}
              </div>
              <div className="text-muted-foreground mt-1 text-xs">{k.hint}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
