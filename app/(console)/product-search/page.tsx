import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Button } from "@0625chopin/shared/ui/button";
import { ProductInfoCard } from "@/components/admin";
import { getProductDetail, getProductImages } from "@/lib/queries/products";
import type { AdminProductRow, ProductImage } from "@/lib/types";
import { ProductSearchForm } from "./_components/product-search-form";

// 상품검색 (신규) — UID 를 입력받아 같은 화면에 상품 정보를 조회·표시한다.
// 신규 쿼리 없이 기존 getProductDetail 재사용. 조치가 필요하면 "상세로 이동"으로 진입.

export default async function ProductSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ uid?: string }>;
}) {
  const { uid } = await searchParams;

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-foreground text-xl font-bold">상품 검색</h1>
        <p className="text-muted-foreground text-sm">
          상품 UID 로 상품·경매 정보를 조회합니다. (목록의 상품 UID 를 복사해
          입력하세요)
        </p>
      </header>

      <ProductSearchForm defaultValue={uid} />

      {uid ? (
        <Suspense key={uid} fallback={<SearchFallback />}>
          <SearchResult uid={uid} />
        </Suspense>
      ) : (
        <p className="text-muted-foreground text-sm">
          조회할 상품 UID 를 입력한 뒤 검색하세요.
        </p>
      )}
    </div>
  );
}

async function SearchResult({ uid }: { uid: string }) {
  // products.id 는 UUID 타입이라 형식이 잘못된 입력은 Postgres 에러를 던진다.
  // 운영자 오타 등 조회 실패는 예외가 아닌 "없음"으로 취급한다.
  let product: AdminProductRow | null = null;
  let images: ProductImage[] = [];
  try {
    [product, images] = await Promise.all([
      getProductDetail(uid),
      getProductImages(uid),
    ]);
  } catch {
    product = null;
  }

  if (!product) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>상품을 찾을 수 없습니다</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <p>
            UID “{uid}” 에 해당하는 상품이 없습니다. UID 형식이 올바른지
            확인하세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ProductInfoCard
      product={product}
      images={images}
      actions={
        <Button asChild variant="outline">
          <Link href={`/products/${product.id}`}>상품 상세로 이동</Link>
        </Button>
      }
    />
  );
}

function SearchFallback() {
  return (
    <div className="text-muted-foreground text-sm">상품 정보를 불러오는 중…</div>
  );
}
