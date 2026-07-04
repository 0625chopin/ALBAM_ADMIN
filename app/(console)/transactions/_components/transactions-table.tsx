"use client";

// 거래 목록 + 필터 (FA040, 클라이언트)
// 상태/당사자 필터. 데이터는 서버 페이지가 props 주입(Mock).

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@0625chopin/shared/ui/input";
import { Button } from "@0625chopin/shared/ui/button";
import { StatusBadge } from "@0625chopin/shared/common/status-badge";
import { AdminTable, type AdminTableColumn } from "@/components/admin";
import { formatCount, formatDate } from "@/lib/format-admin";
import { TRANSACTION_STATUS_LABEL } from "@/lib/labels-admin";
import type { AdminTransactionRow, TransactionStatus } from "@/lib/types";

const STATUS_FILTERS: { value: TransactionStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "pending", label: "진행중" },
  { value: "completed", label: "거래완료" },
  { value: "auto_completed", label: "자동완료" },
  { value: "canceled", label: "취소" },
];

export function TransactionsTable({
  transactions,
}: {
  transactions: AdminTransactionRow[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TransactionStatus | "all">("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (!q) return true;
      return (
        t.productTitle.toLowerCase().includes(q) ||
        t.sellerNickname.toLowerCase().includes(q) ||
        t.buyerNickname.toLowerCase().includes(q)
      );
    });
  }, [transactions, query, status]);

  const columns: AdminTableColumn<AdminTransactionRow>[] = [
    {
      key: "productTitle",
      header: "상품",
      render: (t) => (
        <Link
          href={`/transactions/${t.id}`}
          className="hover:text-primary max-w-[20rem] truncate font-medium underline-offset-4 hover:underline"
        >
          {t.productTitle}
        </Link>
      ),
    },
    {
      key: "sellerNickname",
      header: "판매자",
      className: "text-muted-foreground",
    },
    {
      key: "buyerNickname",
      header: "구매자",
      className: "text-muted-foreground",
    },
    {
      key: "finalPrice",
      header: "거래가",
      align: "right",
      render: (t) => `${formatCount(t.finalPrice)}원`,
    },
    {
      key: "status",
      header: "상태",
      align: "center",
      render: (t) => (
        <StatusBadge
          kind="transaction"
          status={t.status}
          label={TRANSACTION_STATUS_LABEL[t.status]}
        />
      ),
    },
    {
      key: "createdAt",
      header: "성립일",
      className: "text-muted-foreground",
      render: (t) => formatDate(t.createdAt),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상품 · 판매자 · 구매자 검색"
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
          {formatCount(rows.length)}건
        </span>
      </div>
      <AdminTable
        columns={columns}
        rows={rows}
        getRowKey={(t) => t.id}
        emptyMessage="조건에 맞는 거래가 없습니다"
      />
    </div>
  );
}
