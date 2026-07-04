import { Suspense } from "react";
import { PagePlaceholder } from "@/components/console/page-placeholder";

// 상품·경매 상세 (FA031). 실화면은 TA023(A2).
// cacheComponents 환경: 동적 params 는 Suspense 안의 async 자식에서 await (ISSUE-011 패턴).
async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title={`상품·경매 상세 · ${id}`}
      description="상품 정보·입찰 현황·신고 내역 및 강제 내림/블라인드/경매 강제 종료"
      task="TA023"
    />
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <PagePlaceholder
          title="상품·경매 상세"
          description="상품 정보·입찰 현황·신고 내역 및 강제 내림/블라인드/경매 강제 종료"
          task="TA023"
        />
      }
    >
      <ProductDetail params={params} />
    </Suspense>
  );
}
