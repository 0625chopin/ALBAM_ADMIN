import { PagePlaceholder } from "@/components/console/page-placeholder";

// 신고·제재 (FA050~FA052). 신고 시스템은 2차 도입(OPEN-1). 실화면은 TA025(A2).
export default function ReportsPage() {
  return (
    <PagePlaceholder
      title="신고·제재"
      description="신고 처리 큐(대상유형·사유·상태)와 제재 이력"
      task="TA025"
      tier={2}
    />
  );
}
