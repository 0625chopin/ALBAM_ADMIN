"use client";

// 관리자 조치 확인 다이얼로그 (FA002 감사 로그 reason 대비)
// A2: 사유 필수 입력 UX + before/after 요약 표시까지(표현). 실제 조치 실행(mutation)은 A3/A5.
// requireReason 이면 사유 미입력 시 실행 버튼 비활성 → 감사 로그 reason 강제.

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@0625chopin/shared/ui/dialog";
import { Button } from "@0625chopin/shared/ui/button";
import { Textarea } from "@0625chopin/shared/ui/textarea";
import { Label } from "@0625chopin/shared/ui/label";
import { Badge } from "@0625chopin/shared/ui/badge";
import type { ReactNode } from "react";

export interface AdminActionDialogProps {
  /** 다이얼로그를 여는 트리거(버튼 등) */
  trigger: ReactNode;
  /** 조치 제목 (예: "계정 정지") */
  title: string;
  /** 조치 설명 */
  description?: string;
  /** 실행 버튼 라벨 (기본 "실행") */
  actionLabel?: string;
  /** 위험 조치 여부 → destructive 스타일 */
  destructive?: boolean;
  /** 사유 필수 입력 (기본 true) */
  requireReason?: boolean;
  /** 우선순위 티어 배지(1/2) — 제재수단 범위 시각 구분(OPEN-2) */
  tier?: 1 | 2;
  /** before/after 요약 (선택) */
  summary?: ReactNode;
  /** 실행 콜백. A2 단계는 미전달(no-op) → 인터랙션은 A3에서 연결 */
  onConfirm?: (reason: string) => void;
}

export function AdminActionDialog({
  trigger,
  title,
  description,
  actionLabel = "실행",
  destructive = false,
  requireReason = true,
  tier,
  summary,
  onConfirm,
}: AdminActionDialogProps) {
  const [reason, setReason] = useState("");
  const disabled = requireReason && reason.trim().length === 0;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
            {tier === 2 && <Badge variant="outline">2차</Badge>}
          </DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {summary && (
          <div className="bg-muted/40 text-muted-foreground rounded-md border p-3 text-sm">
            {summary}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="admin-action-reason">
            사유 {requireReason && <span className="text-destructive">*</span>}
          </Label>
          <Textarea
            id="admin-action-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="조치 사유를 입력하세요 (감사 로그에 기록됩니다)"
            rows={3}
            aria-invalid={disabled}
          />
          <p className="text-muted-foreground text-xs">
            모든 관리자 조치는 감사 로그(admin_action_logs)에 기록됩니다 —
            FA002.
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={disabled}
            onClick={() => onConfirm?.(reason.trim())}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
