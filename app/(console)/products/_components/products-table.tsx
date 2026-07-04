"use client";

// 상품·경매 목록 + 필터 (FA030, 클라이언트)
// 신고 많은 상품 우선 정렬(기본). 상태/검색 필터. 데이터는 서버 페이지가 props 주입(Mock).

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@0625chopin/shared/ui/input";
import { Button } from "@0625chopin/shared/ui/button";
import { Badge } from "@0625chopin/shared/ui/badge";
import { StatusBadge } from "@0625chopin/shared/common/status-badge";
import { AdminTable, type AdminTableColumn } from "@/components/admin";
import { formatCount } from "@/lib/format-admin";
import {
  PRODUCT_STATUS_LABEL,
  CATEGORY_LABEL,
  labelOf,
} from "@/lib/labels-admin";
import type { AdminProductRow, ProductStatus } from "@/lib/types";

const STATUS_FILTERS: { value: ProductStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "경매중" },
  { value: "won", label: "낙찰" },
  { value: "completed", label: "완료" },
  { value: "withdrawn", label: "내림" },
  { value: "failed", label: "유찰" },
];

export function ProductsTable({ products }: { products: AdminProductRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProductStatus | "all">("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => {
        if (status !== "all" && p.status !== status) return false;
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          p.sellerNickname.toLowerCase().includes(q)
        );
      })
      // 신고 많은 상품 우선 정렬 (FA030) — 동수면 최신 마감 우선
      .sort((a, b) => b.reportCount - a.reportCount);
  }, [products, query, status]);

  const columns: AdminTableColumn<AdminProductRow>[] = [
    {
      key: "title",
      header: "상품",
      render: (p) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${p.id}`}
            className="hover:text-primary max-w-[22rem] truncate font-medium underline-offset-4 hover:underline"
          >
            {p.title}
          </Link>
          {p.isBlinded && <Badge variant="outline">블라인드</Badge>}
        </div>
      ),
    },
    {
      key: "sellerNickname",
      header: "판매자",
      className: "text-muted-foreground",
    },
    {
      key: "category",
      header: "카테고리",
      className: "text-muted-foreground",
      render: (p) => labelOf(CATEGORY_LABEL, p.category),
    },
    {
      key: "currentPrice",
      header: "현재가",
      align: "right",
      render: (p) => `${formatCount(p.currentPrice)}원`,
    },
    {
      key: "status",
      header: "상태",
      align: "center",
      render: (p) => (
        <StatusBadge
          kind="product"
          status={p.status}
          label={PRODUCT_STATUS_LABEL[p.status]}
        />
      ),
    },
    {
      key: "reportCount",
      header: "신고",
      align: "right",
      render: (p) => (
        <span
          className={
            p.reportCount >= 3 ? "text-destructive font-semibold" : ""
          }
        >
          {formatCount(p.reportCount)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상품명 · 판매자 검색"
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={status === f.value ? "default" : "outline"}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <span className="text-muted-foreground ml-auto text-sm">
          {formatCount(rows.length)}건 · 신고순
        </span>
      </div>
      <AdminTable
        columns={columns}
        rows={rows}
        getRowKey={(p) => p.id}
        emptyMessage="조건에 맞는 상품이 없습니다"
      />
    </div>
  );
}
