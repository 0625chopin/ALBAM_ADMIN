"use client";

// 회원 목록 + 필터 (FA020, 클라이언트 — 검색/정지 필터 상태)
// 데이터는 서버 페이지가 props로 주입(Mock). 실 전환 시 조회부만 교체(UI 무수정).

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@0625chopin/shared/ui/input";
import { Button } from "@0625chopin/shared/ui/button";
import { Badge } from "@0625chopin/shared/ui/badge";
import { LevelBadge } from "@0625chopin/shared/common/level-badge";
import { AdminTable, type AdminTableColumn } from "@/components/admin";
import { formatCount, formatDate } from "@/lib/format-admin";
import type { AdminMemberRow } from "@/lib/types";

export function UsersTable({ members }: { members: AdminMemberRow[] }) {
  const [query, setQuery] = useState("");
  const [suspendedOnly, setSuspendedOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (suspendedOnly && !m.isSuspended) return false;
      if (!q) return true;
      return (
        m.nickname.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.region.toLowerCase().includes(q)
      );
    });
  }, [members, query, suspendedOnly]);

  const columns: AdminTableColumn<AdminMemberRow>[] = [
    {
      key: "id",
      header: "회원ID",
      render: (m) => (
        <span
          className="text-muted-foreground font-mono text-xs"
          title={m.id}
        >
          {m.id}
        </span>
      ),
    },
    {
      key: "nickname",
      header: "닉네임",
      render: (m) => (
        <Link
          href={`/users/${m.id}`}
          className="hover:text-primary font-medium underline-offset-4 hover:underline"
        >
          {m.nickname}
        </Link>
      ),
    },
    {
      key: "email",
      header: "이메일",
      className: "text-muted-foreground",
      render: (m) => <span className="text-xs">{m.email}</span>,
    },
    { key: "region", header: "지역", className: "text-muted-foreground" },
    {
      key: "sellerLevel",
      header: "판매/구매 레벨",
      render: (m) => (
        <div className="flex gap-1">
          <LevelBadge level={m.sellerLevel} role="seller" />
          <LevelBadge level={m.buyerLevel} role="buyer" />
        </div>
      ),
    },
    {
      key: "recentPenaltyCount",
      header: "최근 패널티",
      align: "right",
      render: (m) => (
        <span className={m.recentPenaltyCount >= 3 ? "text-destructive font-semibold" : ""}>
          {formatCount(m.recentPenaltyCount)}
        </span>
      ),
    },
    {
      key: "reportedCount",
      header: "신고",
      align: "right",
      render: (m) => formatCount(m.reportedCount),
    },
    {
      key: "isSuspended",
      header: "상태",
      align: "center",
      render: (m) =>
        m.isSuspended ? (
          <Badge variant="destructive">정지</Badge>
        ) : (
          <Badge variant="secondary">정상</Badge>
        ),
    },
    {
      key: "joinedAt",
      header: "가입일",
      className: "text-muted-foreground",
      render: (m) => formatDate(m.joinedAt),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="닉네임 · ID · 이메일 · 지역 검색"
          className="max-w-xs"
        />
        <Button
          variant={suspendedOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setSuspendedOnly((v) => !v)}
        >
          정지 회원만
        </Button>
        <span className="text-muted-foreground ml-auto text-sm">
          {formatCount(filtered.length)}명
        </span>
      </div>
      <AdminTable
        columns={columns}
        rows={filtered}
        getRowKey={(m) => m.id}
        emptyMessage="조건에 맞는 회원이 없습니다"
      />
    </div>
  );
}
