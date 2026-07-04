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
import { MOCK_ADMIN_RATINGS } from "@/lib/mocks/admin";

// 악성 평점 처리 (FA080) `3차(선택)` — 코멘트 블라인드(실동작)/삭제.
// 코멘트 블라인드는 admin_blind_content('rating') 실 호출. 목록은 Mock 행(실데이터 전환은 차기).
// 평점 삭제(평판 재계산 연동)는 별도 RPC 필요 — 차기.
export default function RatingsPage() {
  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-bold">평점 관리</h1>
        <Badge variant="outline">3차</Badge>
      </header>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-sm font-semibold">
            신고·악성 의심 평점
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-border divide-y">
            {MOCK_ADMIN_RATINGS.map((r) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
