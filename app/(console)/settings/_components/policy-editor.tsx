"use client";

// 정책 수치 편집 + 범위 검증 표시 (FA061, 클라이언트) `2차`
// 범위(min~max)를 벗어나면 경고. 저장은 admin_update_policy(범위 밖 거부) Server Action 연동(TA056).

import { useState } from "react";
import { Input } from "@0625chopin/shared/ui/input";
import { Button } from "@0625chopin/shared/ui/button";
import { AdminActionDialog } from "@/components/admin";
import type { MockPolicy } from "@/lib/mocks/admin";
import { updatePolicyAction } from "../_actions";

function PolicyRow({ policy }: { policy: MockPolicy }) {
  const [value, setValue] = useState(String(policy.value));
  const num = Number(value);
  const invalid = Number.isNaN(num) || num < policy.min || num > policy.max;
  const dirty = num !== policy.value;

  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <div className="min-w-[12rem] flex-1">
        <div className="text-foreground text-sm font-medium">
          {policy.label}
        </div>
        <div className="text-muted-foreground text-xs">
          허용 {policy.min}~{policy.max}
          {policy.unit}
          {policy.note ? ` · ${policy.note}` : ""}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={invalid}
          className="w-28"
        />
        <span className="text-muted-foreground w-8 text-sm">{policy.unit}</span>
        <AdminActionDialog
          trigger={
            <Button size="sm" variant="outline" disabled={invalid || !dirty}>
              저장
            </Button>
          }
          title={`정책 변경 · ${policy.label}`}
          description="정책 수치 변경은 감사 로그에 기록됩니다. 범위를 벗어난 값은 거부됩니다."
          actionLabel="변경"
          tier={2}
          summary={`${policy.label}: ${policy.value}${policy.unit} → ${num}${policy.unit}`}
          onConfirm={(reason) => updatePolicyAction(policy.key, num, reason)}
        />
      </div>
      {invalid && (
        <p className="text-destructive w-full text-xs">
          허용 범위({policy.min}~{policy.max}
          {policy.unit})를 벗어났습니다. 저장 시 클램프/거부됩니다.
        </p>
      )}
    </div>
  );
}

export function PolicyEditor({ policies }: { policies: MockPolicy[] }) {
  return (
    <div className="divide-border divide-y rounded-lg border px-4">
      {policies.map((p) => (
        <PolicyRow key={p.key} policy={p} />
      ))}
    </div>
  );
}
