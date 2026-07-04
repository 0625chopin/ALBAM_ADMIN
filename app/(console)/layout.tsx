import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ToastProvider } from "@/components/admin/toast";
import { assertAdminAccess } from "@/lib/auth/admin-gate";

// 콘솔 셸: 좌측 사이드바 + 우측 콘텐츠.
// 접근 통제(ADR-0005 §3): ① 미들웨어 proxy.ts(세션, TS17) → ② admin_users 실게이팅(TA057)
//   → ③ 본 레이아웃 게이트(심층 방어).
//
// ⚠️ 게이트(is_admin RPC)는 쿠키/connection 의존 = uncached data 이므로 Suspense 경계 밖에서
//    await 하면 라우트 전체 렌더를 블로킹한다(blocking-route, ISSUE-011/025). 따라서 레이아웃은
//    동기 셸만 렌더하고, 게이트 await 는 Suspense 안의 async AdminGate 로 이동한다.
export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      {/* AdminSidebar 는 usePathname()(동적)을 쓰므로 Suspense 경계 안에 둔다.
          동적 라우트(/products/[id] 등) 셸 prerender 차단 방지 — ISSUE-011 패턴.
          BO는 PC 전용: 기본 펼침 사이드바(w-60), 접기 시 w-16. 인-플로우(콘텐츠를 밀어냄).
          fallback 은 레이아웃 시프트 방지를 위해 기본 펼침 폭(w-60) 유지. */}
      <Suspense
        fallback={
          <div className="bg-sidebar border-sidebar-border h-screen w-60 shrink-0 border-r" />
        }
      >
        <AdminSidebar />
      </Suspense>
      <main className="min-w-0 flex-1 overflow-x-auto">
        <ToastProvider>
          {/* 심층 방어 게이트: 관리자만 children 렌더, 비관리자는 /login 리다이렉트.
              await 가 이 Suspense 경계 안에 있어 셸 prerender 를 블로킹하지 않는다. */}
          <Suspense fallback={null}>
            <AdminGate>{children}</AdminGate>
          </Suspense>
        </ToastProvider>
      </main>
    </div>
  );
}

// 레이아웃 레벨 심층 방어(비관리자 차단). 1차 방어는 미들웨어(proxy.ts).
async function AdminGate({ children }: Readonly<{ children: React.ReactNode }>) {
  const allowed = await assertAdminAccess();
  if (!allowed) {
    redirect("/login");
  }
  return children;
}
