// KPI 카드 (대시보드 지표 1종, 순수 props, 서버 컴포넌트)
// value 클릭 시 href 로 해당 목록 이동(FA010). 실데이터 전환 시 값만 교체.

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { cn } from "@0625chopin/shared/utils";
import { formatCount } from "@/lib/format-admin";

export interface KpiCardProps {
  /** 지표 라벨 (예: "총 회원수") */
  label: string;
  /** 지표 값. number 는 천단위 콤마 포맷, string 은 그대로(예: "82.4%") */
  value: number | string;
  /** 보조 설명 (집계 근거 등) */
  hint?: string;
  /** 클릭 시 이동 경로 (선택) */
  href?: string;
}

export function KpiCard({ label, value, hint, href }: KpiCardProps) {
  const display = typeof value === "number" ? formatCount(value) : value;

  const body = (
    <Card
      className={cn(
        "transition-colors",
        href && "hover:border-primary/50 hover:bg-accent/40"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-foreground text-2xl font-bold tabular-nums">
          {display}
        </div>
        {hint && (
          <div className="text-muted-foreground mt-1 text-xs">{hint}</div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
