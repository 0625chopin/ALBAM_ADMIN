import { PagePlaceholder } from "@/components/console/page-placeholder";

// 채팅 모니터링 (FA070, 3차·선택). 열람 개인정보 정책 OPEN-6. 실화면은 TA027(A2).
export default function ChatPage() {
  return (
    <PagePlaceholder
      title="채팅 모니터링"
      description="신고된 채팅방/메시지 조회·블라인드"
      task="TA027"
      tier={3}
    />
  );
}
