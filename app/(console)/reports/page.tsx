import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";
import { ReportsQueue } from "./_components/reports-queue";
import { MOCK_REPORTS, MOCK_SUSPENSIONS } from "@/lib/mocks/admin";
import { formatDate } from "@/lib/format-admin";

// 신고·제재 (FA050~FA052) `2차` — 신고 2차 도입(OPEN-1), 타입 선반영. Mock.
export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-bold">신고·제재</h1>
        <Badge variant="outline">2차</Badge>
      </header>

      {/* 신고 처리 큐 (FA051) */}
      <section className="space-y-2">
        <h2 className="text-muted-foreground text-sm font-semibold">
          신고 처리 큐
        </h2>
        <ReportsQueue reports={MOCK_REPORTS} />
      </section>

      {/* 제재 이력 (FA052) — 신고→제재 연결, 회원별 누적 */}
      <section>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground text-sm font-semibold">
              제재 이력{" "}
              <span className="text-muted-foreground">
                ({MOCK_SUSPENSIONS.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-border divide-y">
              {MOCK_SUSPENSIONS.map((s) => (
                <li key={s.id} className="py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/users/${s.userId}`}
                      className="hover:text-primary text-foreground font-medium underline-offset-4 hover:underline"
                    >
                      {s.userId}
                    </Link>
                    <Badge variant={s.liftedAt ? "outline" : "destructive"}>
                      {s.liftedAt ? "해제됨" : s.endsAt ? "정지중" : "영구정지"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {s.reason} · {formatDate(s.startsAt)} ~{" "}
                    {s.endsAt ? formatDate(s.endsAt) : "무기한"}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
