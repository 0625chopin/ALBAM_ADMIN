// 심화 통계 실데이터 조회 (Phase A5x / FA090)
// 추이(가입/경매/거래/GMV)는 대시보드 추이 RPC(get_admin_dashboard_trend)를 재사용한다.
// 카테고리 분포는 products.category 집계 + codes(group_key='category') 라벨 결합. products/codes 는 public read.
// Mock(lib/mocks/admin)과 동일한 도메인 계약을 반환해 UI 무수정 전환을 보장한다.

import { createClient } from "@0625chopin/shared/supabase/server";
import { getDashboardTrend } from "./dashboard";
import type {
  CategoryDistribution,
  TrendMetric,
  TrendPoint,
} from "@/lib/types";

/** 기간별 추이 (가입/경매/거래/GMV) — 대시보드 추이 RPC 재사용. 기본 30일. */
export async function getAnalyticsTrend(
  days = 30,
): Promise<Record<TrendMetric, TrendPoint[]>> {
  return getDashboardTrend(days);
}

/** 카테고리별 상품 분포 (FA090) — products.category 집계 + codes(category) 라벨, count 내림차순 */
export async function getCategoryDistribution(): Promise<
  CategoryDistribution[]
> {
  const supabase = await createClient();
  const [{ data: products, error: pErr }, { data: codes, error: cErr }] =
    await Promise.all([
      supabase.from("products").select("category"),
      supabase.from("codes").select("code, label").eq("group_key", "category"),
    ]);
  if (pErr) throw pErr;
  if (cErr) throw cErr;

  const labelMap = new Map((codes ?? []).map((c) => [c.code, c.label]));
  const counts = new Map<string, number>();
  for (const p of products ?? []) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({
      category,
      categoryLabel: labelMap.get(category) ?? category,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}
