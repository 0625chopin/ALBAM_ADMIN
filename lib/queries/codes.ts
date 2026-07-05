// 공통코드 조회 (Server Component 용) — 관리자 콘솔
// codes 테이블은 공개 SELECT(anon/authenticated). 신고 사유 등 코드→라벨 맵을 서버에서 조회해
// 표현 컴포넌트에 주입한다. FO(신고 모달)와 동일하게 codes.report_reason 를 단일 소스로 사용한다.
// 캐싱: 프로세스 단위 모듈 싱글턴(그룹별 최초 1회 조회 후 재사용). 실패/빈 결과는 캐시하지 않는다.

import { createClient } from "@0625chopin/shared/supabase/server";
import type { CodeGroupKey } from "@/lib/types";

const labelCache = new Map<CodeGroupKey, Promise<Record<string, string>>>();

/** 공통코드 그룹의 코드→라벨 맵 (활성만, sort_order 순). 실패 시 빈 맵(무폴백, 캐시 안 함). */
export function fetchCodeLabels(
  groupKey: CodeGroupKey
): Promise<Record<string, string>> {
  const cached = labelCache.get(groupKey);
  if (cached) return cached;

  const promise = (async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("codes")
      .select("code, label")
      .eq("group_key", groupKey)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) {
      labelCache.delete(groupKey);
      return {};
    }
    return Object.fromEntries(data.map((r) => [r.code, r.label]));
  })();

  labelCache.set(groupKey, promise);
  return promise;
}

/** 신고 사유 코드→라벨 맵 (codes.report_reason). FO 신고 모달과 공유하는 단일 소스 (FA050). */
export function fetchReasonLabels(): Promise<Record<string, string>> {
  return fetchCodeLabels("report_reason");
}
