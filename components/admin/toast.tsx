"use client";

// 경량 토스트 (조치 완료 피드백용, 외부 라이브러리 없음)
// 콘솔 레이아웃이 ToastProvider 로 감싸고, AdminActionDialog 등이 useToast()로 알림을 띄운다.
// Mock 단계: 실제 mutation 없이 "조치 완료(Mock)" 피드백. 실 동작은 A5.

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@0625chopin/shared/utils";

type ToastVariant = "default" | "destructive";
interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const ToastContext = createContext<
  (message: string, opts?: { variant?: ToastVariant }) => void
>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback(
    (message: string, opts?: { variant?: ToastVariant }) => {
      const id = ++idRef.current;
      setToasts((t) => [
        ...t,
        { id, message, variant: opts?.variant ?? "default" },
      ]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3500);
    },
    []
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="fixed right-4 bottom-4 z-50 flex flex-col gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "bg-background flex items-center gap-2 rounded-md border px-4 py-3 text-sm shadow-lg",
              t.variant === "destructive"
                ? "border-destructive/40"
                : "border-border"
            )}
          >
            {t.variant === "destructive" ? (
              <AlertTriangle className="text-destructive size-4 shrink-0" />
            ) : (
              <CheckCircle2 className="size-4 shrink-0 text-green-600 dark:text-green-500" />
            )}
            <span className="text-foreground">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
