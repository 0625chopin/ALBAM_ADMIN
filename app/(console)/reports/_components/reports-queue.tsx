"use client";

// 신고 처리 큐 + 필터 (FA051, 클라이언트) — 실 mutation(admin_resolve_report, TA056) 연동.
// 상태 필터 + 처리(처리완료/반려) 버튼. 데이터는 서버 페이지 props 주입, 처리 후 revalidate + refresh.

import { useMemo, useState } from "react";
import { Button } from "@0625chopin/shared/ui/button";
import { Badge } from "@0625chopin/shared/ui/badge";
import type { BadgeProps } from "@0625chopin/shared/ui/badge";
import { AdminTable, AdminActionDialog, type AdminTableColumn } from "@/components/admin";
import { formatCount, formatDate } from "@/lib/format-admin";
import {
  REPORT_TARGET_LABEL,
  REPORT_REASON_LABEL,
  REPORT_STATUS_LABEL,
  labelOf,
} from "@/lib/labels-admin";
import type { Report, ReportStatus } from "@/lib/types";
import { resolveReportAction } from "../_actions";

const STATUS_VARIANT: Record<ReportStatus, BadgeProps["variant"]> = {
  pending: "default",
  reviewing: "secondary",
  resolved: "outline",
  rejected: "outline",
};

const STATUS_FILTERS: { value: ReportStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "pending", label: "대기" },
  { value: "reviewing", label: "검토중" },
  { value: "resolved", label: "처리완료" },
  { value: "rejected", label: "반려" },
];

export function ReportsQueue({ reports }: { reports: Report[] }) {
  const [status, setStatus] = useState<ReportStatus | "all">("all");

  // 데이터는 서버 props 원천. 처리 후 Server Action 이 revalidatePath + router.refresh 로 갱신한다.
  const rows = useMemo(
    () =>
      status === "all" ? reports : reports.filter((r) => r.status === status),
    [reports, status]
  );

  const columns: AdminTableColumn<Report>[] = [
    {
      key: "targetType",
      header: "대상",
      render: (r) => (
        <Badge variant="outline">
          {labelOf(REPORT_TARGET_LABEL, r.targetType)}
        </Badge>
      ),
    },
    {
      key: "reason",
      header: "사유",
      render: (r) => labelOf(REPORT_REASON_LABEL, r.reason),
    },
    {
      key: "detail",
      header: "상세",
      className: "text-muted-foreground max-w-[20rem] truncate",
      render: (r) => r.detail ?? "-",
    },
    {
      key: "status",
      header: "상태",
      align: "center",
      render: (r) => (
        <Badge variant={STATUS_VARIANT[r.status]}>
          {REPORT_STATUS_LABEL[r.status]}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "접수일",
      className: "text-muted-foreground",
      render: (r) => formatDate(r.createdAt),
    },
    {
      key: "action",
      header: "처리",
      align: "center",
      render: (r) =>
        r.status === "pending" || r.status === "reviewing" ? (
          <div className="flex justify-center gap-1">
            {/* 처리완료(resolved) — 제재 연결/콘텐츠 조치 후 종결 */}
            <AdminActionDialog
              trigger={
                <Button size="sm" variant="outline">
                  처리완료
                </Button>
              }
              title="신고 처리 완료"
              tier={2}
              description="신고를 처리(제재 연결 · 콘텐츠 조치)하고 종결합니다. 처리 사유는 감사 로그에 기록됩니다."
              actionLabel="처리 완료"
              summary={`대상: ${labelOf(REPORT_TARGET_LABEL, r.targetType)} · 사유: ${labelOf(REPORT_REASON_LABEL, r.reason)}`}
              onConfirm={(reason) => resolveReportAction(r.id, "resolved", reason)}
            />
            {/* 반려(rejected) — 조치 불필요 판단 */}
            <AdminActionDialog
              trigger={
                <Button size="sm" variant="ghost">
                  반려
                </Button>
              }
              title="신고 반려"
              tier={2}
              destructive
              description="신고를 반려합니다. 반려 사유는 감사 로그에 기록됩니다."
              actionLabel="반려"
              summary={`대상: ${labelOf(REPORT_TARGET_LABEL, r.targetType)} · 사유: ${labelOf(REPORT_REASON_LABEL, r.reason)}`}
              onConfirm={(reason) => resolveReportAction(r.id, "rejected", reason)}
            />
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">
            {r.resolution ?? "처리됨"}
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={status === f.value ? "default" : "outline"}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <span className="text-muted-foreground ml-auto text-sm">
          {formatCount(rows.length)}건
        </span>
      </div>
      <AdminTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        emptyMessage="해당 상태의 신고가 없습니다"
      />
    </div>
  );
}
