// 운영 설정 실데이터 조회 (Phase A5 / TA056)
// 공통코드(code_groups/codes)와 정책 수치(codes.policy)를 실 조회한다. codes/code_groups 는 public read.
// 정책의 허용 범위(min/max)·단위·라벨 메타는 DB 에 없으므로 TS 메타맵과 num_value 를 결합한다.
// 편집 가능 정책 집합·범위는 admin_update_policy RPC 의 backstop 과 정합해야 한다(정책 단일소스).

import { createClient } from "@0625chopin/shared/supabase/server";
import type { MockCodeGroup, MockPolicy } from "@/lib/mocks/admin";

/** 편집 가능 정책 메타(코드 → 라벨/범위/단위). admin_update_policy RPC 의 범위와 동일. */
const POLICY_META: Record<
  string,
  { label: string; min: number; max: number; unit: string; note?: string }
> = {
  auto_complete_wait_hours: {
    label: "거래 자동완료 대기",
    min: 24,
    max: 168,
    unit: "시간",
    note: "ISSUE-002 · 24~168h",
  },
  penalty_restriction_threshold: {
    label: "패널티 등록차단 임계",
    min: 1,
    max: 10,
    unit: "회",
    note: "ISSUE-004 · 30일 누적",
  },
  penalty_window_days: {
    label: "패널티 누적 기간",
    min: 7,
    max: 90,
    unit: "일",
  },
  min_bid_increment: {
    label: "최소 입찰 증가폭",
    min: 100,
    max: 100000,
    unit: "원",
  },
  default_auction_duration_hours: {
    label: "기본 경매 진행 시간",
    min: 12,
    max: 336,
    unit: "시간",
  },
};

/** 정책 수치 목록 (FA061) — codes.policy num_value + TS 메타 결합 */
export async function getPolicies(): Promise<MockPolicy[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("codes")
    .select("code, num_value")
    .eq("group_key", "policy");
  if (error) throw error;

  const valueMap = new Map(
    (data ?? []).map((c) => [c.code, Number(c.num_value ?? 0)])
  );

  // 메타에 정의된 편집 대상 정책만, 정의 순서대로 노출
  return Object.entries(POLICY_META).map(([key, meta]) => ({
    key,
    label: meta.label,
    value: valueMap.get(key) ?? meta.min,
    min: meta.min,
    max: meta.max,
    unit: meta.unit,
    note: meta.note,
  }));
}

/** 공통코드 그룹 목록 (FA060) — code_groups + codes(활성) */
export async function getCodeGroups(): Promise<MockCodeGroup[]> {
  const supabase = await createClient();
  const [{ data: groups, error: gErr }, { data: codes, error: cErr }] =
    await Promise.all([
      supabase.from("code_groups").select("group_key, name").order("group_key"),
      supabase
        .from("codes")
        .select("group_key, code, label, is_active, sort_order")
        .eq("is_active", true)
        .order("sort_order"),
    ]);
  if (gErr) throw gErr;
  if (cErr) throw cErr;

  // 정책 그룹은 수치 설정이라 공통코드 목록에서 제외(정책 에디터가 별도 담당)
  return (groups ?? [])
    .filter((g) => g.group_key !== "policy")
    .map((g) => ({
      key: g.group_key,
      label: g.name,
      codes: (codes ?? [])
        .filter((c) => c.group_key === g.group_key)
        .map((c) => ({ code: c.code, label: c.label })),
    }));
}
