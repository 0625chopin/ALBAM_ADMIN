import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";
import { Button } from "@0625chopin/shared/ui/button";
import { StarRating } from "@0625chopin/shared/common/star-rating";
import { AdminActionDialog } from "@/components/admin";
import { blindContentAction } from "../_actions/moderation";
import { getFlaggedRatings } from "@/lib/queries/ratings";

// 악성 평점 처리 (FA080) `3차(선택)` — 코멘트 블라인드(실동작)/삭제.
// 실 Supabase 조회(FA080): 신고된 평점 + 블라인드된 평점. UI 컴포넌트 무수정, 데이터 소스만 Mock→조회 교체.
// 코멘트 블라인드는 admin_blind_content('rating') 실 호출. 평점 삭제(평판 재계산)는 별도 RPC 필요 — 차기.
// cacheComponents: 동적(쿠키 기반) 조회는 Suspense 안 async 자식에서 수행.
export default function RatingsPage() {
  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-bold">평점 관리</h1>
        <Badge variant="outline">3차</Badge>
      </header>

      <Suspense
        fallback={<p className="text-muted-foreground text-sm">불러오는 중…</p>}
      >
        <RatingsData />
      </Suspense>
    </div>
  );
}

// 조회부: 신고·악성 의심 평점 목록을 실데이터로 조회 후 표현.
async function RatingsData() {
  const ratings = await getFlaggedRatings();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-sm font-semibold">
          신고·악성 의심 평점
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ratings.length === 0 ? (
          <p className="text-muted-foreground py-2 text-sm">
            신고·악성 의심 평점이 없습니다.
          </p>
        ) : (
          <ul className="divide-border divide-y">
            {ratings.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <StarRating score={r.score} max={10} />
                    <span className="text-muted-foreground text-xs">
                      {r.raterId} → {r.rateeId}
                    </span>
                    {r.isBlinded && <Badge variant="outline">블라인드</Badge>}
                  </div>
                  <p
                    className={`text-sm ${r.isBlinded ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {r.comment ?? "(코멘트 없음)"}
                  </p>
                </div>
                {!r.isBlinded && (
                  <div className="flex gap-2">
                    <AdminActionDialog
                      trigger={
                        <Button size="sm" variant="outline">
                          코멘트 블라인드
                        </Button>
                      }
                      title="코멘트 블라인드"
                      description="악성 코멘트를 숨깁니다(별점은 유지)."
                      actionLabel="블라인드"
                      tier={2}
                      summary={`대상 평점: ${r.id}`}
                      onConfirm={blindContentAction.bind(null, "rating", r.id)}
                    />
                    <AdminActionDialog
                      trigger={
                        <Button size="sm" variant="destructive">
                          삭제
                        </Button>
                      }
                      title="평점 삭제"
                      description="평점을 삭제합니다(평판 재계산 대상)."
                      actionLabel="삭제"
                      destructive
                      tier={2}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
