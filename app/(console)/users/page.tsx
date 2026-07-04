import { Suspense } from "react";
import { UsersTable } from "./_components/users-table";
import { TableSkeleton } from "@/components/admin/skeleton-blocks";
import { getMembers } from "@/lib/queries/members";

// 회원 관리 목록 (FA020) — 실 Supabase 조회(TA051). UI 무수정, 조회부만 교체.
// cacheComponents: 동적(쿠키 기반) 조회는 Suspense 안 async 자식에서 수행.
export default function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-foreground text-xl font-bold">회원 관리</h1>
        <p className="text-muted-foreground text-sm">
          회원 검색·필터 및 상세 이력·조치
        </p>
      </header>
      <Suspense fallback={<TableSkeleton />}>
        <UsersData />
      </Suspense>
    </div>
  );
}

async function UsersData() {
  const members = await getMembers();
  return <UsersTable members={members} />;
}
