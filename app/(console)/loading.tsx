import { Skeleton } from "@0625chopin/shared/ui/skeleton";
import { CardsSkeleton, TableSkeleton } from "@/components/admin/skeleton-blocks";

// 콘솔 공통 Loading 상태 (라우트 전환 중). 화면별 대략적 스켈레톤.
export default function ConsoleLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <CardsSkeleton count={3} />
      <TableSkeleton rows={6} />
    </div>
  );
}
