import { ShieldAlert } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";
import { Button } from "@0625chopin/shared/ui/button";
import { AdminActionDialog } from "@/components/admin";
import { MOCK_ADMIN_MESSAGES, maskPii } from "@/lib/mocks/admin";
import { formatDateTime } from "@/lib/format-admin";

// 채팅 모니터링 (FA070) `3차(선택)` — OPEN-6: 신고 방/메시지 범위 제한 + 마스킹 + 열람 감사.
// Mock 은 마스킹된 내용만 표시. 원문 열람(감사 기록)은 A5.
export default function ChatPage() {
  const roomId = MOCK_ADMIN_MESSAGES[0]?.roomId ?? "-";

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center gap-2">
        <h1 className="text-foreground text-xl font-bold">채팅 모니터링</h1>
        <Badge variant="outline">3차</Badge>
      </header>

      {/* OPEN-6 개인정보 정책 안내 */}
      <div className="border-border bg-muted/40 text-muted-foreground flex items-start gap-2 rounded-md border p-3 text-sm">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        <p>
          개인정보 보호(OPEN-6): <strong>신고된 방/메시지</strong>만 조회
          가능하며, 전화번호·이메일은 <strong>자동 마스킹</strong>됩니다. 원문
          열람은 열람 감사 기록 후 제공됩니다(A5).
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-sm font-semibold">
            신고 채팅방{" "}
            <span className="text-muted-foreground font-mono text-xs">
              {roomId}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_ADMIN_MESSAGES.map((m) => (
              <li
                key={m.id}
                className="border-border flex items-start justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-xs">
                      {m.senderId}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatDateTime(m.createdAt)}
                    </span>
                    {m.isBlinded && <Badge variant="outline">블라인드</Badge>}
                  </div>
                  <p
                    className={`mt-1 text-sm ${m.isBlinded ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {maskPii(m.content)}
                  </p>
                </div>
                {!m.isBlinded && (
                  <AdminActionDialog
                    trigger={
                      <Button size="sm" variant="outline">
                        블라인드
                      </Button>
                    }
                    title="메시지 블라인드"
                    description="부적절한 메시지를 숨깁니다(감사/복구 목적)."
                    actionLabel="블라인드"
                    tier={2}
                  />
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
