// 채팅 모니터링 실데이터 조회 (Phase A5x / FA070, OPEN-6)
// chat_rooms/messages 는 당사자 전용 RLS라 관리자가 직접 SELECT 불가.
// get_admin_reported_messages() SECURITY DEFINER RPC 로 신고된 방/메시지만 조회한다(OPEN-6 범위 제한).
// Mock(lib/mocks/admin)과 동일한 도메인 계약(AdminMessageView)을 반환해 UI 무수정 전환을 보장한다.

import { createClient } from "@0625chopin/shared/supabase/server";
import type { AdminMessageView } from "@/lib/types";

// RPC(get_admin_reported_messages) 가 반환하는 jsonb 원소 계약(snake_case)
interface RawReportedMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_blinded: boolean;
}

/** 신고된 방/메시지 목록 (FA070) — 신고된 메시지를 포함한 방의 메시지, 방·시각 순 */
export async function getReportedMessages(): Promise<AdminMessageView[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_admin_reported_messages");
  if (error) throw error;
  const rows = (data as unknown as RawReportedMessage[]) ?? [];
  return rows.map((m) => ({
    id: m.id,
    roomId: m.room_id,
    senderId: m.sender_id,
    content: m.content,
    createdAt: m.created_at,
    isBlinded: m.is_blinded,
  }));
}
