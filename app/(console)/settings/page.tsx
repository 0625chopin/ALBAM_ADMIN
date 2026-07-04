import { PagePlaceholder } from "@/components/console/page-placeholder";

// 운영 설정 (FA060·FA061). 실화면은 TA026(A2)에서 Mock 데이터로 구현.
export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="운영 설정"
      description="공통코드 CRUD와 정책 수치 조정(범위 검증)"
      task="TA026"
      tier={2}
    />
  );
}
