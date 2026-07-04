"use client";

// 신고 처리 큐 + 필터 (FA051, 클라이언트) — 2차, OPEN-1(신고 2차 도입)
// 상태 필터 + 처리 버튼 UI(제재/삭제/반려, 인터랙션 A3/TA032). 데이터는 서버 페이지 props 주입.

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
          <AdminActionDialog
            trigger={
              <Button size="sm" variant="outline">
                처리
              </Button>
            }
            title="신고 처리"
            description="제재 연결 · 콘텐츠 삭제 · 반려 중 조치를 선택합니다(사유 필수)."
            actionLabel="처리 완료"
            summary={`대상: ${labelOf(REPORT_TARGET_LABEL, r.targetType)} · 사유: ${labelOf(REPORT_REASON_LABEL, r.reason)}`}
          />
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
