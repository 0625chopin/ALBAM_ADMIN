"use client";

// 테마 토글 (다크/라이트). next-themes 기반, 사이드바 푸터에 배치.
// 하이드레이션 미스매치 방지: mounted 전에는 중립 표시(서버/클라 초기 렌더 일치).

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@0625chopin/shared/utils";

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true; // 기본 dark 전제(SSR 일치)
  const label = isDark ? "라이트 모드" : "다크 모드";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={collapsed ? label : undefined}
      aria-label="테마 전환"
      className={cn(
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      {/* mounted 전에는 아이콘을 고정(dark 전제 → Sun)해 SSR/CSR 렌더 일치 */}
      {isDark ? (
        <Sun className="size-4 shrink-0" />
      ) : (
        <Moon className="size-4 shrink-0" />
      )}
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}
