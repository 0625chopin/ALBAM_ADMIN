"use client";

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

  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border flex h-screen w-14 shrink-0 flex-col border-r md:w-60">
      <div className="border-sidebar-border flex h-14 items-center justify-center gap-2 border-b px-2 md:justify-start md:px-4">
        <span className="text-lg">🛡️</span>
        <span className="hidden font-bold md:inline">알밤마켓 관리자</span>
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
                "flex items-center justify-center gap-3 rounded-md px-3 py-2 text-sm transition-colors md:justify-start",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="hidden md:inline">{label}</span>
              {tier > 1 && (
                <span className="text-sidebar-foreground/50 ml-auto hidden text-[10px] md:inline">
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
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-center gap-3 rounded-md px-3 py-2 text-sm transition-colors md:justify-start"
        >
          <LogOut className="size-4 shrink-0" />
          <span className="hidden md:inline">로그아웃</span>
        </button>
        <p className="text-sidebar-foreground/60 hidden px-3 text-xs md:block">
          알밤마켓 운영자 콘솔
        </p>
      </div>
    </aside>
  );
}
