import { Suspense } from "react";
import { PagePlaceholder } from "@/components/console/page-placeholder";

// 거래 분쟁 상세 (FA041). 실화면은 TA024(A2).
// cacheComponents 환경: 동적 params 는 Suspense 안의 async 자식에서 await (ISSUE-011 패턴).
async function TransactionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title={`거래 상세 · ${id}`}
      description="거래 당사자·상태 이력·분쟁 내역 및 강제 취소/완료"
      task="TA024"
    />
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
