// 상품 정보 표시 컴포넌트 (상품 상세·상품검색 공용, 순수 props)
// 제목+상태배지+UID·설명 헤더 + 경매 정보 dl 그리드. 조치 버튼 등은 actions 슬롯으로 주입한다.
// 상세 페이지는 강제 내림/블라인드 버튼을, 상품검색은 "상세로 이동" 버튼을 actions 로 전달.

import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";
import { StatusBadge } from "@0625chopin/shared/common/status-badge";
import { ProductImage as ProductImageView } from "@0625chopin/shared/common/product-image";
import { formatCount, formatDateTime } from "@/lib/format-admin";
import {
  PRODUCT_STATUS_LABEL,
  CATEGORY_LABEL,
  CONDITION_LABEL,
  labelOf,
} from "@/lib/labels-admin";
import type { AdminProductRow, ProductImage } from "@/lib/types";

export function ProductInfoCard({
  product,
  images,
  actions,
  headingLevel = 2,
}: {
  product: AdminProductRow;
  /** 업로드된 상품 이미지 목록 (대표 우선). 없으면 갤러리 미표시 */
  images?: ProductImage[];
  /** 제목 헤더 우측에 배치할 조치/이동 버튼 등 */
  actions?: ReactNode;
  /** 제목 heading 레벨. 상세 페이지는 상품명이 페이지 주제이므로 1, 검색 결과는 2(기본) */
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
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
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Heading className="text-foreground text-xl font-bold">
              {product.title}
            </Heading>
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
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>

      {images && images.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground text-sm font-semibold">
              상품 이미지 ({images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={img.id} className="relative">
                  <ProductImageView
                    src={img.url}
                    alt={`${product.title} 이미지 ${i + 1}`}
                    width={192}
                    height={192}
                    priority={i === 0}
                    className="border-border h-48 w-48 rounded-md border object-cover"
                    placeholderClassName="h-48 w-48 rounded-md border"
                  />
                  {img.isPrimary && (
                    <Badge className="absolute top-2 left-2">대표</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
