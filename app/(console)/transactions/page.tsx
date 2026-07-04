import { TransactionsTable } from "./_components/transactions-table";
import { MOCK_ADMIN_TRANSACTIONS } from "@/lib/mocks/admin";

// 거래 관리 목록 (FA040) — Mock. 실 전환은 A5(TA051).
export default function TransactionsPage() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-foreground text-xl font-bold">거래 관리</h1>
        <p className="text-muted-foreground text-sm">
          상태·당사자 필터 및 분쟁 상세·강제 취소/완료 (Mock)
        </p>
      </header>
      <TransactionsTable transactions={MOCK_ADMIN_TRANSACTIONS} />
    </div>
  );
}
