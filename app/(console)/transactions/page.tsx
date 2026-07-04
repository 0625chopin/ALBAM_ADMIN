import { Suspense } from "react";
import { TransactionsTable } from "./_components/transactions-table";
import { TableSkeleton } from "@/components/admin/skeleton-blocks";
import { getTransactions } from "@/lib/queries/transactions";

// 거래 관리 목록 (FA040) — 실 Supabase 조회(TA051). UI 무수정, 조회부만 교체.
export default function TransactionsPage() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-foreground text-xl font-bold">거래 관리</h1>
        <p className="text-muted-foreground text-sm">
          상태·당사자 필터 및 분쟁 상세·강제 취소/완료
        </p>
      </header>
      <Suspense fallback={<TableSkeleton />}>
        <TransactionsData />
      </Suspense>
    </div>
  );
}

async function TransactionsData() {
  const transactions = await getTransactions();
  return <TransactionsTable transactions={transactions} />;
}
