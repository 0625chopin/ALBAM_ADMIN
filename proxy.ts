import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

// Next canary 컨벤션: 루트 proxy.ts 가 미들웨어. admin 세션 가드를 매 요청 실행.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 정적 파일/이미지 제외 전 경로 매칭.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
