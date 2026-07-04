// 신고·제재 실데이터 조회 (Phase A5 / TA056, FA051~FA052)
// reports·user_suspensions 는 관리자 전용 RLS(is_admin())라 인증된 관리자 세션(server client)으로
// 직접 SELECT 한다. Mock(lib/mocks/admin)과 동일한 도메인 계약(lib/types)을 반환해 UI 무수정 전환을 보장한다.

import { createClient } from "@0625chopin/shared/supabase/server";
import type { Report, UserSuspension } from "@/lib/types";
import { toReport, toUserSuspension } from "./_map";

/** 신고 처리 큐 목록 (FA051) — 접수 최신순. RLS 로 관리자만 조회 가능. */
export async function getReports(): Promise<Report[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toReport);
}

/** 제재 이력 (FA052) — 정지 시작 최신순. RLS 로 관리자만 조회 가능. */
export async function getRecentSuspensions(): Promise<UserSuspension[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_suspensions")
    .select("*")
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toUserSuspension);
}
