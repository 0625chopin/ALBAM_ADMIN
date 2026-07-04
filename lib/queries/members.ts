// 회원 관리 실데이터 조회 (Phase A5 / TA051)
// joinedAt(가입일)은 auth.users.created_at 이 필요하고 정지/패널티/신고/평판 집계가 함께 필요해
// SECURITY DEFINER + is_admin() 게이트 RPC(get_admin_members/get_admin_member_detail,
// 마이그레이션 admin_a5_member_read_rpcs)로 조회한다. 반환 jsonb 는 AdminMemberRow/Detail 계약과 1:1.

import { createClient } from "@0625chopin/shared/supabase/server";
import type { AdminMemberRow, AdminMemberDetail } from "@/lib/types";

/** 회원 목록 (FA020) — get_admin_members */
export async function getMembers(): Promise<AdminMemberRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_members");
  if (error) throw error;
  return (data as unknown as AdminMemberRow[]) ?? [];
}

/** 회원 상세 (FA021) — get_admin_member_detail. 미존재 id 는 null */
export async function getMemberDetail(
  id: string
): Promise<AdminMemberDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_member_detail", {
    p_user_id: id,
  });
  if (error) throw error;
  return (data as unknown as AdminMemberDetail | null) ?? null;
}
