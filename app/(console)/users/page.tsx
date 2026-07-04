import { UsersTable } from "./_components/users-table";
import { MOCK_MEMBERS } from "@/lib/mocks/admin";

// 회원 관리 목록 (FA020) — Mock. 실 Supabase 조회 전환은 A5(TA051), UI 무수정.
export default function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-foreground text-xl font-bold">회원 관리</h1>
        <p className="text-muted-foreground text-sm">
          회원 검색·필터 및 상세 이력·조치 (Mock)
        </p>
      </header>
      <UsersTable members={MOCK_MEMBERS} />
    </div>
  );
}
