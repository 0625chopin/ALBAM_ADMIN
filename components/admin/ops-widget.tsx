// 운영 위젯 (대시보드 목록형 위젯, 순수 props, 서버 컴포넌트)
// 마감임박 경매·자동완료 대기·최근 신고·최근 가입 등 공통 형태(OpsWidgetItem[]).

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import type { OpsWidgetItem } from "@/lib/mocks/admin";

export interface OpsWidgetProps {
  /** 위젯 제목 */
  title: string;
  /** 표시 행 */
  items: OpsWidgetItem[];
  /** 비었을 때 안내 */
  emptyMessage?: string;
}

export function OpsWidget({
  title,
  items,
  emptyMessage = "항목이 없습니다",
}: OpsWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-sm font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground px-2 py-6 text-center text-sm">
            {emptyMessage}
          </p>
        ) : (
          <ul className="divide-border divide-y">
            {items.map((item) => {
              const row = (
                <div className="flex items-center justify-between gap-3 px-2 py-2">
                  <span className="text-foreground truncate text-sm">
                    {item.label}
                  </span>
                  <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                    {item.meta}
                    {item.href && <ChevronRight className="size-3" />}
                  </span>
                </div>
              );
              return (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="hover:bg-accent/40 block rounded-md transition-colors"
                    >
                      {row}
                    </Link>
                  ) : (
                    row
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
