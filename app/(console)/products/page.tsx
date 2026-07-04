import { ProductsTable } from "./_components/products-table";
import { MOCK_ADMIN_PRODUCTS } from "@/lib/mocks/admin";

// 상품·경매 관리 목록 (FA030) — 신고 많은 상품 우선 정렬. Mock. 실 전환은 A5(TA051).
export default function ProductsPage() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-foreground text-xl font-bold">상품·경매 관리</h1>
        <p className="text-muted-foreground text-sm">
          상태·판매자 필터 및 강제 내림/블라인드 조치 (Mock)
        </p>
      </header>
      <ProductsTable products={MOCK_ADMIN_PRODUCTS} />
    </div>
  );
}
