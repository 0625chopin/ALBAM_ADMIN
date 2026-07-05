// 평점 실데이터 조회 (Phase A5x / FA080)
// '신고·악성 의심 평점' = reports(target_type='rating') 대상 + is_blinded=true 합집합.
// ratings 는 public read 라 인증된 관리자 세션(server client)으로 직접 SELECT 하고, reports 는 관리자 RLS.
// Mock(lib/mocks/admin)과 동일한 도메인 계약(AdminRatingView)을 반환해 UI 무수정 전환을 보장한다.

import { createClient } from "@0625chopin/shared/supabase/server";
import type { AdminRatingView } from "@/lib/types";

/** 신고·악성 의심 평점 목록 (FA080) — 신고된 평점 + 블라인드된 평점, 접수 최신순 */
export async function getFlaggedRatings(): Promise<AdminRatingView[]> {
  const supabase = await createClient();

  // 신고된 평점 id 수집 (reports.target_type='rating')
  const { data: reps, error: repErr } = await supabase
    .from("reports")
    .select("target_id")
    .eq("target_type", "rating");
  if (repErr) throw repErr;
  const reportedIds = Array.from(new Set((reps ?? []).map((r) => r.target_id)));

  // 신고된 평점 + 블라인드된 평점(합집합) 조회
  const orFilter = reportedIds.length
    ? `id.in.(${reportedIds.join(",")}),is_blinded.eq.true`
    : `is_blinded.eq.true`;
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .or(orFilter)
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id,
    transactionId: r.transaction_id,
    raterId: r.rater_id,
    rateeId: r.ratee_id,
    role: r.role as AdminRatingView["role"],
    score: r.score,
    comment: r.comment,
    isBlinded: r.is_blinded,
  }));
}
