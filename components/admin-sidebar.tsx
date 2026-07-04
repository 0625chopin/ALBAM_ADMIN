"use client";

import { useState } from "react";
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
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@0625chopin/shared/utils";
import { createClient } from "@0625chopin/shared/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

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

// BO(관리자 콘솔)는 PC 전용. 모바일 반응형 분기 없이, 기본 펼침 사이드바 +
// 접기/펼치기 토글(더 넓은 작업 공간 확보). 인-플로우(콘텐츠를 옆으로 밀어냄).
export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-sidebar-border flex h-screen shrink-0 flex-col border-r transition-[width] duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* 헤더: 접기/펼치기 토글 + 브랜드 */}
      <div className="border-sidebar-border flex h-14 items-center gap-2 border-b px-2">
        <button
          type="button"
          aria-label={collapsed ? "메뉴 펼치기" : "메뉴 접기"}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((v) => !v)}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shrink-0 rounded-md p-2 transition-colors"
        >
          {collapsed ? (
            <PanelLeft className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </button>
        {!collapsed && (
          <span className="flex items-center gap-2 overflow-hidden">
            <span className="text-lg">🛡️</span>
            <span className="font-bold whitespace-nowrap">알밤마켓 관리자</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV.map(({ href, label, icon: Icon, tier }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                collapsed ? "justify-center" : "justify-start",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && (
                <span className="whitespace-nowrap">{label}</span>
              )}
              {!collapsed && tier > 1 && (
                <span className="text-sidebar-foreground/50 ml-auto text-[10px]">
                  {tier}차
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-sidebar-border space-y-2 border-t p-2">
        <ThemeToggle collapsed={collapsed} />
        <button
          type="button"
          title={collapsed ? "로그아웃" : undefined}
          onClick={async () => {
            await createClient().auth.signOut();
            window.location.assign("/login");
          }}
          className={cn(
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">로그아웃</span>}
        </button>
        {!collapsed && (
          <p className="text-sidebar-foreground/60 px-3 text-xs whitespace-nowrap">
            알밤마켓 운영자 콘솔
          </p>
        )}
      </div>
    </aside>
  );
}
