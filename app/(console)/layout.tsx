import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ToastProvider } from "@/components/admin/toast";
import { assertAdminAccess } from "@/lib/auth/admin-gate";

// 콘솔 셸: 좌측 사이드바 + 우측 콘텐츠.
// 접근 통제(ADR-0005 §3): ① 미들웨어 proxy.ts(세션, TS17) → ② admin_users 실게이팅(TA057)
//   → ③ 본 레이아웃 게이트(심층 방어). Mock 단계는 assertAdminAccess 가 임시 통과(TA012).
export default async function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 레이아웃 레벨 심층 방어: 비관리자는 /login 으로 (Mock 단계는 항상 통과).
  const allowed = await assertAdminAccess();
  if (!allowed) {
    redirect("/login");
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen">
      {/* AdminSidebar 는 usePathname()(동적)을 쓰므로 Suspense 경계 안에 둔다.
          동적 라우트(/products/[id] 등) 셸 prerender 차단 방지 — ISSUE-011 패턴.
          데스크톱은 정적 사이드바(w-60), 모바일은 고정 오버레이 드로어라 흐름 공간 미차지.
          fallback 은 데스크톱만 폭 예약(모바일은 상단 햄버거 바가 별도). */}
      <Suspense
        fallback={
          <div className="bg-sidebar border-sidebar-border hidden h-screen w-60 shrink-0 border-r md:block" />
        }
      >
        <AdminSidebar />
      </Suspense>
      {/* 모바일은 상단 고정 햄버거 바(h-14)만큼 콘텐츠를 아래로 밀어준다. */}
      <main className="flex-1 overflow-x-auto pt-14 md:pt-0">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  );
}
