// 관리자 게이트 (레이아웃 레벨 방어, TA057 실연결)
// ADR-0005 §3.4: admin 앱은 /login 외 전 경로가 보호 대상(운영자 콘솔).
// 1차 방어는 미들웨어(proxy.ts), 본 게이트는 레이아웃 레벨 심층 방어(defense-in-depth).
//
// 실게이팅(A5/TA057): 세션 사용자 auth.uid() 의 admin_users 소속을 is_admin() RPC 로 서버 검증.

import { createClient } from "@0625chopin/shared/supabase/server";

/**
 * 콘솔 접근 허용 여부 판정 (레이아웃에서 호출).
 * is_admin()(SECURITY DEFINER, auth.uid() ∈ admin_users) 로 관리자 소속을 검증한다.
 * 비관리자/미인증/오류는 false → 레이아웃에서 redirect("/login").
 */
export async function assertAdminAccess(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}
