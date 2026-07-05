// 상품·경매 관리 실데이터 조회 (Phase A5 / TA051)
// 상품은 auth.users 가 불필요하므로 RLS 준수 server client 로 조회한다.
// (products=public read, is_blinded 컬럼 노출, reports=admin RLS 조회 후 target 집계, 판매자 닉네임 profiles 조인)
// 공유 도메인 매퍼(toProduct) 재사용 + 관리자 파생(isBlinded/reportCount/sellerNickname) 조립.

import { createClient } from "@0625chopin/shared/supabase/server";
import { toProduct, toProductImage } from "@0625chopin/shared/queries/map";
import type { AdminProductRow, ProductImage } from "@/lib/types";

const UNKNOWN_SELLER = "이름 없음";

/** 상품·경매 목록 (FA030) — 신고 많은 상품 우선 정렬 */
export async function getProducts(): Promise<AdminProductRow[]> {
  const supabase = await createClient();

  const [{ data: products, error }, { data: profiles }, { data: reports }] =
    await Promise.all([
      supabase.from("products").select("*"),
      supabase.from("profiles").select("id, nickname"),
      supabase.from("reports").select("target_id").eq("target_type", "product"),
    ]);
  if (error) throw error;

  const nickMap = new Map((profiles ?? []).map((p) => [p.id, p.nickname]));
  const reportCountMap = new Map<string, number>();
  for (const r of reports ?? []) {
    reportCountMap.set(r.target_id, (reportCountMap.get(r.target_id) ?? 0) + 1);
  }

  const rows: AdminProductRow[] = (products ?? []).map((p) => ({
    ...toProduct(p),
    isBlinded: p.is_blinded,
    reportCount: reportCountMap.get(p.id) ?? 0,
    sellerNickname: nickMap.get(p.seller_id) ?? UNKNOWN_SELLER,
  }));

  // 신고 많은 순 우선 (동수는 최신 생성 우선)
  rows.sort((a, b) => b.reportCount - a.reportCount);
  return rows;
}

/** 상품·경매 상세 (FA031) — 미존재 id 는 null */
export async function getProductDetail(
  id: string
): Promise<AdminProductRow | null> {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!product) return null;

  const [{ data: seller }, { count }] = await Promise.all([
    supabase
      .from("profiles")
      .select("nickname")
      .eq("id", product.seller_id)
      .maybeSingle(),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("target_type", "product")
      .eq("target_id", id),
  ]);

  return {
    ...toProduct(product),
    isBlinded: product.is_blinded,
    reportCount: count ?? 0,
    sellerNickname: seller?.nickname ?? UNKNOWN_SELLER,
  };
}

/** 상품 이미지 목록 (product_images, public read) — 대표(is_primary) 우선, 등록순 */
export async function getProductImages(
  productId: string
): Promise<ProductImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("id, product_id, url, is_primary")
    .eq("product_id", productId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toProductImage);
}
