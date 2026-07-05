import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";
import { ReportsQueue } from "./_components/reports-queue";
import { getReports, getRecentSuspensions } from "@/lib/queries/reports";
import { fetchReasonLabels } from "@/lib/queries/codes";
import { formatDate } from "@/lib/format-admin";

// 신고·제재 (FA050~FA052) — 실 Supabase 조회(TA056). UI 컴포넌트 무수정, 데이터 소스만 Mock→조회 교체.
// cacheComponents: 동적(쿠키 기반) 조회는 Suspense 안 async 자식에서 수행.
export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-bold">신고·제재</h1>
      </header>

      <Suspense
        fallback={
          <p className="text-muted-foreground text-sm">불러오는 중…</p>
        }
      >
        <ReportsData />
      </Suspense>
    </div>
  );
}

// 조회부: 신고 큐 + 제재 이력을 병렬 조회 후 표현 컴포넌트에 주입.
async function ReportsData() {
  const [reports, suspensions, reasonLabels] = await Promise.all([
    getReports(),
    getRecentSuspensions(),
    fetchReasonLabels(),
  ]);

  return (
    <>
      {/* 신고 처리 큐 (FA051) */}
      <section className="space-y-2">
        <h2 className="text-muted-foreground text-sm font-semibold">
          신고 처리 큐
        </h2>
        <ReportsQueue reports={reports} reasonLabels={reasonLabels} />
      </section>

      {/* 제재 이력 (FA052) — 신고→제재 연결, 회원별 누적 */}
      <section>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground text-sm font-semibold">
              제재 이력{" "}
              <span className="text-muted-foreground">
                ({suspensions.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {suspensions.length === 0 ? (
              <p className="text-muted-foreground py-2 text-sm">
                제재 이력이 없습니다.
              </p>
            ) : (
              <ul className="divide-border divide-y">
                {suspensions.map((s) => (
                  <li key={s.id} className="py-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/users/${s.userId}`}
                        className="hover:text-primary text-foreground font-medium underline-offset-4 hover:underline"
                      >
                        {s.userId}
                      </Link>
                      <Badge variant={s.liftedAt ? "outline" : "destructive"}>
                        {s.liftedAt
                          ? "해제됨"
                          : s.endsAt
                            ? "정지중"
                            : "영구정지"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {s.reason} · {formatDate(s.startsAt)} ~{" "}
                      {s.endsAt ? formatDate(s.endsAt) : "무기한"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
