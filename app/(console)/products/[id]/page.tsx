import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Button } from "@0625chopin/shared/ui/button";
import { AdminActionDialog, ProductInfoCard } from "@/components/admin";
import { PagePlaceholder } from "@/components/console/page-placeholder";
import { getProductDetail, getProductImages } from "@/lib/queries/products";
import { forceWithdrawProductAction, forceCloseAuctionAction } from "./_actions";
import {
  blindContentAction,
  unblindContentAction,
} from "../../_actions/moderation";
import { PRODUCT_STATUS_LABEL } from "@/lib/labels-admin";

// 상품·경매 상세 (FA031) + 조치 버튼 UI(강제 내림 1차·블라인드 2차, 인터랙션 A3).
async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, images] = await Promise.all([
    getProductDetail(id),
    getProductImages(id),
  ]);

  if (!product) {
    return (
      <div className="p-6">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>상품을 찾을 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-sm">
            <p>ID “{id}” 에 해당하는 상품이 없습니다.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/products">상품 목록으로</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAuctionOpen = product.status === "active";

  return (
    <div className="space-y-6 p-6">
      <ProductInfoCard
        product={product}
        images={images}
        headingLevel={1}
        actions={
          <>
            <AdminActionDialog
              trigger={
                <Button variant="destructive" disabled={!isAuctionOpen}>
                  강제 내림
                </Button>
              }
              title="상품 강제 내림"
              description="판매 상태를 강제로 내림(withdrawn) 처리합니다. (진행중 경매만 가능)"
              actionLabel="강제 내림"
              destructive
              summary={`대상: ${product.title} · ${PRODUCT_STATUS_LABEL[product.status]} → 내림`}
              onConfirm={forceWithdrawProductAction.bind(null, product.id)}
            />
            {product.isBlinded ? (
              <AdminActionDialog
                trigger={<Button variant="outline">블라인드 해제</Button>}
                title="블라인드 해제"
                description="숨김을 해제하고 노출을 복구합니다(감사 기록)."
                actionLabel="블라인드 해제"
                tier={2}
                summary={`대상: ${product.title} · 블라인드 → 노출 복구`}
                onConfirm={unblindContentAction.bind(
                  null,
                  "product",
                  product.id
                )}
              />
            ) : (
              <AdminActionDialog
                trigger={<Button variant="outline">블라인드</Button>}
                title="콘텐츠 블라인드"
                description="상태는 유지하고 노출만 숨깁니다(감사/복구 목적)."
                actionLabel="블라인드"
                tier={2}
                summary={`대상: ${product.title} · 노출 → 블라인드(숨김)`}
                onConfirm={blindContentAction.bind(null, "product", product.id)}
              />
            )}
            {isAuctionOpen && (
              <AdminActionDialog
                trigger={<Button variant="ghost">경매 강제 종료</Button>}
                title="경매 강제 종료"
                description="진행중 경매를 즉시 유찰 처리합니다(거래 미성립·낙찰 없음)."
                actionLabel="강제 종료"
                tier={2}
                summary={`대상: ${product.title} · 경매중 → 유찰(거래 미성립)`}
                onConfirm={forceCloseAuctionAction.bind(null, product.id)}
              />
            )}
          </>
        }
      />
    </div>
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
          description="경매 정보·신고 내역 및 강제 내림/블라인드 조치"
          task="TA023"
        />
      }
    >
      <ProductDetail params={params} />
    </Suspense>
  );
}
