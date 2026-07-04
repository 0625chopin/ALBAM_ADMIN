import { Button } from "@0625chopin/shared/ui/button";
import { Badge } from "@0625chopin/shared/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";

// 관리자 컴포넌트 전시장 골격 — @0625chopin/shared 디자인 시스템 소비 확인.
// 실제 관리자 위젯(AdminTable/KpiCard 등)은 ROADMAP_ADMIN A2(TA020~)에서 전시.
export default function AdminSample() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-foreground text-xl font-bold">/sample — 전시장</h1>

      <section className="space-y-3">
        <h2 className="text-muted-foreground text-sm font-semibold">
          Buttons (shared/ui/button)
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-muted-foreground text-sm font-semibold">
          Badges (shared/ui/badge)
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-muted-foreground text-sm font-semibold">
          Card (shared/ui/card)
        </h2>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>공유 디자인 시스템</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            @0625chopin/shared 의 UI·토큰을 admin 앱이 그대로 소비합니다.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
