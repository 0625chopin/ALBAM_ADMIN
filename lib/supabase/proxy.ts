import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "@0625chopin/shared/utils";

// admin 앱 미들웨어 세션 가드. 공개 앱과 달리 "로그인 외 전 경로 보호"(운영자 콘솔).
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // env 미설정 시 세션 체크 스킵(초기 셋업 편의)
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // Fluid compute 대응: 매 요청마다 새로 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ⚠️ createServerClient 와 getClaims() 사이에 어떤 코드도 넣지 말 것(무작위 로그아웃 방지).
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // 관리자 콘솔: /login 외 전 경로 보호. 미인증 → /login.
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/login";
  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // TODO(TA057): 세션이 있으나 admin_users 미소속이면 콘솔 접근 거부/로그아웃.
  //   const uid = user?.sub;  // admin_users 조회(RLS/RPC)로 관리자 여부 확인 후 미소속 시 /login.

  // ⚠️ supabaseResponse 를 그대로 반환할 것(새 응답 생성 시 쿠키 복사 필수).
  return supabaseResponse;
}
