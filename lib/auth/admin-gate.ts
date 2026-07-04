// 관리자 게이트 (레이아웃 레벨 방어, TA012 골격)
// ADR-0005 §3.4: admin 앱은 /login 외 전 경로가 보호 대상(운영자 콘솔).
// 1차 방어는 미들웨어(proxy.ts), 본 게이트는 레이아웃 레벨 심층 방어(defense-in-depth).
//
// Mock 단계(A1~A3): 임시 통과 플래그로 콘솔을 열어두고 화면부터 개발(Mock First).
// 실게이팅(세션 + admin_users 소속 검증)은 TA057(A5)에서 연결한다.

/** Mock 단계 임시 통과 플래그. TA057에서 실제 admin_users 검증으로 대체. */
export const ADMIN_GATE_MOCK_PASS = true;

/**
 * 콘솔 접근 허용 여부 판정 (레이아웃에서 호출).
 * Mock 단계는 항상 통과. 실게이팅 전환 시 비관리자는 여기서 redirect/거부한다.
 */
export async function assertAdminAccess(): Promise<boolean> {
  // TODO(TA057): 세션 사용자 auth.uid() 의 admin_users 소속을 서버에서 검증.
  //   const supabase = await createClient(); // @0625chopin/shared/supabase/server
  //   const { data } = await supabase.auth.getClaims();
  //   const uid = data?.claims?.sub;
  //   admin_users 조회(is_admin() RPC/RLS)로 비관리자면 redirect("/login").
  return ADMIN_GATE_MOCK_PASS;
}
