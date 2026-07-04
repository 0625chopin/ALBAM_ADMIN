import { PagePlaceholder } from "@/components/console/page-placeholder";

// 거래 관리 목록 (FA040). 실화면은 TA024(A2)에서 Mock 데이터로 구현.
export default function TransactionsPage() {
  return (
    <PagePlaceholder
      title="거래 관리"
      description="상태·당사자·기간 필터 및 분쟁 상세·강제 취소/완료"
      task="TA024"
    />
  );
}
