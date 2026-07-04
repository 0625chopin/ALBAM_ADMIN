import { Badge } from "@0625chopin/shared/ui/badge";

// 라우트 골격용 공통 placeholder (TA011).
// A2(Mock UI)에서 실제 화면 컴포넌트로 대체된다. 페이지별 제목/설명/담당 Task 를 표시.
export function PagePlaceholder({
  title,
  description,
  task,
  tier = 1,
}: {
  title: string;
  description: string;
  /** 이 화면을 구현하는 로드맵 Task (예: "TA022") */
  task: string;
  /** 우선순위 티어 (1/2/3) */
  tier?: 1 | 2 | 3;
}) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {tier > 1 && <Badge variant="outline">{tier}차</Badge>}
          <Badge variant="secondary">{task}</Badge>
        </div>
      </div>

      <div className="border-border text-muted-foreground flex h-48 items-center justify-center rounded-lg border border-dashed text-sm">
        화면 준비 중 · {task}에서 Mock 데이터로 구현 예정
      </div>
    </div>
  );
}
