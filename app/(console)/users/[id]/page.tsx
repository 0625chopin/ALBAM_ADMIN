import { Suspense } from "react";
import { PagePlaceholder } from "@/components/console/page-placeholder";

// 회원 상세·이력 (FA021). 실화면은 TA022(A2).
// cacheComponents 환경: 동적 params 는 Suspense 안의 async 자식에서 await (ISSUE-011 패턴).
async function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title={`회원 상세 · ${id}`}
      description="레벨·평점·거래/입찰/패널티/신고 이력 종합 및 조치"
      task="TA022"
    />
  );
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <PagePlaceholder
          title="회원 상세"
          description="레벨·평점·거래/입찰/패널티/신고 이력 종합 및 조치"
          task="TA022"
        />
      }
    >
      <UserDetail params={params} />
    </Suspense>
  );
}
