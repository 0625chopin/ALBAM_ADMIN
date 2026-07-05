"use client";

// 상품 UID 셀 (상품경매·거래관리·신고제재 목록 공용)
// 실데이터 UID 는 긴 UUID 이므로 앞 8자리로 축약하고 title 에 전체를 담는다.
// 클릭 시 상품 상세(/products/{id})로 이동. id 가 없으면(비상품 신고 등) "-" 표시.

import Link from "next/link";

export function ProductIdCell({ id }: { id: string | null }) {
  if (!id) return <span className="text-muted-foreground">-</span>;
  const short = id.length > 8 ? `${id.slice(0, 8)}…` : id;
  return (
    <Link
      href={`/products/${id}`}
      title={id}
      className="text-muted-foreground hover:text-primary font-mono text-xs underline-offset-4 hover:underline"
    >
      {short}
    </Link>
  );
}
