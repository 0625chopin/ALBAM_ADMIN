import { Suspense } from "react";
import { ProductsTable } from "./_components/products-table";
import { TableSkeleton } from "@/components/admin/skeleton-blocks";
import { getProducts } from "@/lib/queries/products";

// 상품·경매 관리 목록 (FA030) — 신고 많은 상품 우선 정렬. 실 Supabase 조회(TA051), UI 무수정.
export default function ProductsPage() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-foreground text-xl font-bold">상품·경매 관리</h1>
        <p className="text-muted-foreground text-sm">
          상태·판매자 필터 및 강제 내림/블라인드 조치
        </p>
      </header>
      <Suspense fallback={<TableSkeleton />}>
        <ProductsData />
      </Suspense>
    </div>
  );
}

async function ProductsData() {
  const products = await getProducts();
  return <ProductsTable products={products} />;
}
