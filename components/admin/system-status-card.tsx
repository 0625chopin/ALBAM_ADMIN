// 시스템 상태 카드 (FA013, 순수 props, 서버 컴포넌트)
// pg_cron 잡 최근 실행 상태 + Storage 개요. 실 전환 시 SystemStatus 조회로 교체.

import { CheckCircle2, XCircle, CircleDashed } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";
import type { SystemStatus } from "@/lib/types";
import { formatCount, formatDateTime } from "@/lib/format-admin";

export interface SystemStatusCardProps {
  status: SystemStatus;
}

export function SystemStatusCard({ status }: SystemStatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-sm font-semibold">
          시스템 상태
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {status.cronJobs.map((job) => {
            const Icon =
              job.lastSucceeded === null
                ? CircleDashed
                : job.lastSucceeded
                  ? CheckCircle2
                  : XCircle;
            const tone =
              job.lastSucceeded === null
                ? "text-muted-foreground"
                : job.lastSucceeded
                  ? "text-green-600 dark:text-green-500"
                  : "text-destructive";
            return (
              <li
                key={job.jobName}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Icon className={`size-4 shrink-0 ${tone}`} />
                  <span className="text-foreground truncate font-mono text-xs">
                    {job.jobName}
                  </span>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {job.lastRunAt ? formatDateTime(job.lastRunAt) : "미실행"}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="border-border flex items-center justify-between border-t pt-2">
          <span className="text-muted-foreground text-xs">Storage 객체</span>
          <Badge variant="secondary" className="tabular-nums">
            {formatCount(status.storageObjectCount)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
