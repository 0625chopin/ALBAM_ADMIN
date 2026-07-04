"use client";

import { useEffect, useState } from "react";
import { createClient } from "@0625chopin/shared/supabase/client";
import { Button } from "@0625chopin/shared/ui/button";
import { Input } from "@0625chopin/shared/ui/input";
import { Label } from "@0625chopin/shared/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";

// 관리자 자체 로그인 (TS03 계약): 동일 Supabase Auth 백엔드에 signInWithPassword.
// 성공 시 하드 네비게이션으로 콘솔 진입. admin_users 소속 최종 게이팅은 proxy.ts(TS17)+RLS(TA057).
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // 비관리자(admin_users 미소속)가 콘솔 진입 시 미들웨어(proxy.ts)가 /login?forbidden=1 로
  // 리다이렉트한다(ISSUE-024). 세션은 있으나 권한이 없는 상태이므로 안내 배너를 표시한다.
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    setForbidden(
      new URLSearchParams(window.location.search).get("forbidden") === "1"
    );
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setForbidden(false); // 재로그인 시도 시 안내 배너 해제
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    // 하드 네비게이션 — 미들웨어(proxy.ts)가 세션·admin_users 검증 후 콘솔 노출
    window.location.assign("/");
  }

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🛡️</span> 관리자 로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          {forbidden && (
            <div
              role="alert"
              aria-live="assertive"
              className="border-destructive/40 bg-destructive/10 text-destructive mb-4 rounded-md border px-3 py-2 text-sm"
            >
              관리자 권한이 없는 계정입니다. 관리자 계정으로 로그인해 주세요.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
              />
            </div>
            {error && (
              <p className="text-destructive text-sm" aria-live="polite">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "로그인 중…" : "로그인"}
            </Button>
          </form>
          <p className="text-muted-foreground mt-4 text-xs">
            관리자 권한(admin_users) 이 있는 계정만 콘솔에 접근할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
