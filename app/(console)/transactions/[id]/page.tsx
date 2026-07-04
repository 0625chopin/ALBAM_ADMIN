import { Suspense } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Button } from "@0625chopin/shared/ui/button";
import { StatusBadge } from "@0625chopin/shared/common/status-badge";
import { AdminActionDialog } from "@/components/admin";
import { PagePlaceholder } from "@/components/console/page-placeholder";
import { getMockTransactionDetail } from "@/lib/mocks/admin";
import { formatCount, formatDateTime } from "@/lib/format-admin";
import { TRANSACTION_STATUS_LABEL } from "@/lib/labels-admin";

// 거래 분쟁 상세 (FA041) + 조치 버튼(강제 취소/완료 1차, 인터랙션 A3). Mock.
async function TransactionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tx = getMockTransactionDetail(id);

  if (!tx) {
    return (
      <div className="p-6">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>거래를 찾을 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-sm">
            <p>ID “{id}” 에 해당하는 거래가 없습니다.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/transactions">거래 목록으로</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPending = tx.status === "pending";
  const parties = [
    { role: "판매자", nickname: tx.sellerNickname, id: tx.sellerId },
    { role: "구매자", nickname: tx.buyerNickname, id: tx.buyerId },
  ];

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-foreground text-xl font-bold">
              {tx.productTitle}
            </h1>
            <StatusBadge
              kind="transaction"
              status={tx.status}
              label={TRANSACTION_STATUS_LABEL[tx.status]}
            />
          </div>
          <p className="text-muted-foreground text-sm">
            {tx.id} · 거래가 {formatCount(tx.finalPrice)}원 · 성립{" "}
            {formatDateTime(tx.createdAt)}
          </p>
        </div>
        {isPending && (
          <div className="flex flex-wrap gap-2">
            <AdminActionDialog
              trigger={<Button variant="destructive">강제 취소</Button>}
              title="거래 강제 취소"
              description="진행중 거래를 취소(canceled)합니다. 연쇄 이양 없이 종료됩니다 (ISSUE-007)."
              actionLabel="강제 취소"
              destructive
              summary={`대상: ${tx.productTitle} · 진행중 → 취소`}
            />
            <AdminActionDialog
              trigger={<Button variant="outline">강제 완료</Button>}
              title="거래 강제 완료"
              description="진행중 거래를 완료(completed) 처리합니다. 평판 반영 정책을 확인하세요."
              actionLabel="강제 완료"
              summary={`대상: ${tx.productTitle} · 진행중 → 완료`}
            />
          </div>
        )}
      </header>

      {/* 분쟁 경고 */}
      {tx.disputeReason && (
        <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border p-3 text-sm">
          <AlertTriangle className="size-4 shrink-0" />
          <span>분쟁: {tx.disputeReason}</span>
        </div>
      )}

      {/* 당사자 + 자동완료 */}
      <section className="grid gap-4 sm:grid-cols-3">
        {parties.map((p) => (
          <Card key={p.role}>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm">
                {p.role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/users/${p.id}`}
                className="hover:text-primary text-foreground font-medium underline-offset-4 hover:underline"
              >
                {p.nickname}
              </Link>
              <p className="text-muted-foreground text-xs">{p.id}</p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">
              자동완료 예정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-sm font-medium">
              {tx.autoCompleteAt ? formatDateTime(tx.autoCompleteAt) : "-"}
            </p>
            <p className="text-muted-foreground text-xs">
              24h 무이의 시 자동완료 (ISSUE-002)
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 진행 이력 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-sm font-semibold">
            진행 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-border divide-y">
            {tx.timeline.map((t, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 py-2 text-sm"
              >
                <span className="text-foreground">{t.label}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDateTime(t.at)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <PagePlaceholder
          title="거래 상세"
          description="거래 당사자·상태 이력·분쟁 내역 및 강제 취소/완료"
          task="TA024"
        />
      }
    >
      <TransactionDetail params={params} />
    </Suspense>
  );
}
