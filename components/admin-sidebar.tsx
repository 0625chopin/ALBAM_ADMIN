"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Flag,
  Settings,
  MessagesSquare,
  Star,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@0625chopin/shared/utils";
import { createClient } from "@0625chopin/shared/supabase/client";

// PRD_ADMIN 메뉴 구조 (FA010~FA090). admin 앱 루트가 콘솔이므로 경로는 app/** 기준.
const NAV = [
  { href: "/", label: "대시보드", icon: LayoutDashboard, tier: 1 },
  { href: "/users", label: "회원 관리", icon: Users, tier: 1 },
  { href: "/products", label: "상품·경매", icon: Package, tier: 1 },
  { href: "/transactions", label: "거래 관리", icon: CreditCard, tier: 1 },
  { href: "/reports", label: "신고·제재", icon: Flag, tier: 2 },
  { href: "/settings", label: "운영 설정", icon: Settings, tier: 2 },
  { href: "/chat", label: "채팅 모니터링", icon: MessagesSquare, tier: 3 },
  { href: "/ratings", label: "평점 관리", icon: Star, tier: 3 },
  { href: "/analytics", label: "심화 통계", icon: BarChart3, tier: 3 },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  // 모바일 햄버거 드로어 열림 상태 (데스크톱은 항상 표시라 무관)
  const [open, setOpen] = useState(false);

  // 라우트 이동 시 모바일 드로어 자동 닫기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 모바일 상단 바 + 햄버거 (데스크톱은 숨김) */}
      <header className="bg-sidebar text-sidebar-foreground border-sidebar-border fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-2 border-b px-3 md:hidden">
        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={open}
          aria-controls="admin-sidebar-drawer"
          onClick={() => setOpen(true)}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2 transition-colors"
        >
          <Menu className="size-5" />
        </button>
        <span className="text-lg">🛡️</span>
        <span className="font-bold">알밤마켓 관리자</span>
      </header>

      {/* 모바일 드로어 백드롭 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 사이드바: 데스크톱 정적(w-60) / 모바일 슬라이드인 드로어(w-64) */}
      <aside
        id="admin-sidebar-drawer"
        className={cn(
          // 데스크톱: 정적 사이드바(항상 flex). 모바일: 고정 오버레이 드로어(열림 시 flex, 닫힘 시 hidden).
          "bg-sidebar text-sidebar-foreground border-sidebar-border fixed inset-y-0 left-0 z-50 h-screen w-64 shrink-0 flex-col border-r md:static md:z-auto md:w-60",
          open ? "flex" : "hidden md:flex"
        )}
      >
        <div className="border-sidebar-border flex h-14 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <span className="font-bold">알밤마켓 관리자</span>
          </div>
          {/* 모바일 닫기 버튼 */}
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-1 transition-colors md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {NAV.map(({ href, label, icon: Icon, tier }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
                {tier > 1 && (
                  <span className="text-sidebar-foreground/50 ml-auto text-[10px]">
                    {tier}차
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-sidebar-border space-y-2 border-t p-3">
          <button
            type="button"
            onClick={async () => {
              await createClient().auth.signOut();
              window.location.assign("/login");
            }}
            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            <span>로그아웃</span>
          </button>
          <p className="text-sidebar-foreground/60 px-3 text-xs">
            알밤마켓 운영자 콘솔
          </p>
        </div>
      </aside>
    </>
  );
}
