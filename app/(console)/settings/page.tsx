import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";
import { PolicyEditor } from "./_components/policy-editor";
import { MOCK_CODE_GROUPS, MOCK_POLICIES } from "@/lib/mocks/admin";

// 운영 설정 (FA060·FA061) `2차` — 공통코드 + 정책 수치(범위 검증). Mock.
export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-bold">운영 설정</h1>
        <Badge variant="outline">2차</Badge>
      </header>

      {/* 정책 수치 (FA061) */}
      <section className="space-y-2">
        <h2 className="text-muted-foreground text-sm font-semibold">
          정책 수치 (범위 검증)
        </h2>
        <PolicyEditor policies={MOCK_POLICIES} />
      </section>

      {/* 공통코드 (FA060) */}
      <section className="space-y-2">
        <h2 className="text-muted-foreground text-sm font-semibold">공통코드</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_CODE_GROUPS.map((g) => (
            <Card key={g.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm font-semibold">
                  {g.label}{" "}
                  <span className="text-muted-foreground font-mono text-xs">
                    {g.key}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {g.codes.map((c) => (
                  <Badge key={c.code} variant="secondary" title={c.code}>
                    {c.label}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
