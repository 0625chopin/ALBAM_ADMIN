"use client";

import { useState } from "react";
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
