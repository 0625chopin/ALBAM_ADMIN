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
  // 모바일 펼침 상태(접힘=아이콘 바, 펼침=전체 메뉴). 데스크톱은 항상 전체 표시라 무관.
  const [open, setOpen] = useState(false);

  // 라우트 이동 시 모바일 메뉴 자동 접기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 라벨/브랜드 표시 여부: 모바일은 open 일 때만, 데스크톱(md)은 항상.
  const labelCls = (base: string) =>
    cn(base, open ? "inline" : "hidden", "md:inline");

  return (
    // 인-플로우 사이드바: 콘텐츠를 덮지 않고 옆으로 밀어낸다(오버레이 아님).
    // 모바일 접힘 w-14(아이콘 바) ↔ 펼침 w-60, 데스크톱 항상 w-60.
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-sidebar-border flex h-screen shrink-0 flex-col border-r transition-[width] duration-200 md:w-60",
        open ? "w-60" : "w-14"
      )}
    >
      {/* 헤더: 햄버거 토글(모바일 전용) + 브랜드 */}
      <div className="border-sidebar-border flex h-14 items-center gap-2 border-b px-2 md:px-4">
        <button
          type="button"
          aria-label={open ? "메뉴 접기" : "메뉴 펼치기"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shrink-0 rounded-md p-2 transition-colors md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <span className={cn("items-center gap-2", open ? "flex" : "hidden", "md:flex")}>
          <span className="text-lg">🛡️</span>
          <span className="font-bold whitespace-nowrap">알밤마켓 관리자</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV.map(({ href, label, icon: Icon, tier }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                open ? "justify-start" : "justify-center",
                "md:justify-start",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className={labelCls("whitespace-nowrap")}>{label}</span>
              {tier > 1 && (
                <span
                  className={labelCls(
                    "text-sidebar-foreground/50 ml-auto text-[10px]"
                  )}
                >
                  {tier}차
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-sidebar-border space-y-2 border-t p-2 md:p-3">
        <button
          type="button"
          title="로그아웃"
          onClick={async () => {
            await createClient().auth.signOut();
            window.location.assign("/login");
          }}
          className={cn(
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            open ? "justify-start" : "justify-center",
            "md:justify-start"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          <span className={labelCls("whitespace-nowrap")}>로그아웃</span>
        </button>
        <p
          className={cn(
            "text-sidebar-foreground/60 px-3 text-xs whitespace-nowrap",
            open ? "block" : "hidden",
            "md:block"
          )}
        >
          알밤마켓 운영자 콘솔
        </p>
      </div>
    </aside>
  );
}
