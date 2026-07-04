import { PagePlaceholder } from "@/components/console/page-placeholder";

// 평점 관리 (FA080, 3차·선택). 악성 평점 삭제/코멘트 블라인드. 실화면은 TA027(A2).
export default function RatingsPage() {
  return (
    <PagePlaceholder
      title="평점 관리"
      description="악성 평점 삭제·코멘트 블라인드"
      task="TA027"
      tier={3}
    />
  );
}
