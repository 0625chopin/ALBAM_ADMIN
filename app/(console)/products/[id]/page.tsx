import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";
import { Button } from "@0625chopin/shared/ui/button";
import { StatusBadge } from "@0625chopin/shared/common/status-badge";
import { AdminActionDialog } from "@/components/admin";
import { PagePlaceholder } from "@/components/console/page-placeholder";
import { getProductDetail } from "@/lib/queries/products";
import { forceWithdrawProductAction, forceCloseAuctionAction } from "./_actions";
import {
  blindContentAction,
  unblindContentAction,
} from "../../_actions/moderation";
import { formatCount, formatDateTime } from "@/lib/format-admin";
import {
  PRODUCT_STATUS_LABEL,
  CATEGORY_LABEL,
  CONDITION_LABEL,
  labelOf,
} from "@/lib/labels-admin";

// 상품·경매 상세 (FA031) + 조치 버튼 UI(강제 내림 1차·블라인드 2차, 인터랙션 A3). Mock.
async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductDetail(id);

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

  const info: { label: string; value: string }[] = [
    { label: "판매자", value: product.sellerNickname },
    { label: "카테고리", value: labelOf(CATEGORY_LABEL, product.category) },
    { label: "상품 상태", value: labelOf(CONDITION_LABEL, product.condition) },
    { label: "지역", value: product.region },
    { label: "시작가", value: `${formatCount(product.startPrice)}원` },
    {
      label: "즉시구매가",
      value: product.buyNowPrice ? `${formatCount(product.buyNowPrice)}원` : "-",
    },
    { label: "현재가", value: `${formatCount(product.currentPrice)}원` },
    { label: "마감", value: formatDateTime(product.auctionEndsAt) },
  ];

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-foreground text-xl font-bold">
              {product.title}
            </h1>
            <StatusBadge
              kind="product"
              status={product.status}
              label={PRODUCT_STATUS_LABEL[product.status]}
            />
            {product.isBlinded && <Badge variant="outline">블라인드</Badge>}
            {product.reportCount >= 3 && (
              <Badge variant="destructive">
                신고 {formatCount(product.reportCount)}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {product.id} · {product.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
              onConfirm={unblindContentAction.bind(null, "product", product.id)}
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
        </div>
      </header>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-sm font-semibold">
            경매 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {info.map((row) => (
              <div key={row.label}>
                <dt className="text-muted-foreground text-xs">{row.label}</dt>
                <dd className="text-foreground text-sm font-medium">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
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
